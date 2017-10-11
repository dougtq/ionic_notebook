import { SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AnnotationModel } from './../../models/annotation.model';
import { SqliteConnectionProvider } from './../sqlite-connection/sqlite-connection.service';

@Injectable()
export class AnnotationProvider {
  private db: SQLiteObject;
  private isFirstCall: boolean = true;

  constructor(
    public sqliteConnectionProvider: SqliteConnectionProvider
  ) { }

  private getDb(): Promise<SQLiteObject> {
    if (this.isFirstCall) {
      this.isFirstCall = false;

      return this.sqliteConnectionProvider.getDb('notebook.db')
        .then((db: SQLiteObject) => {
          this.db = db;
          this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS annotations
          (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT
          )
          `, {})
            .then((success) => {
              console.log('Tabela anotação criada com sucesso', success);
            })
            .catch((error) => {
              console.log('Erro ao criar tabela anotação', error);
            })
          return this.db;
        })
    }
    return this.sqliteConnectionProvider.getDb();
  }

  public getAll(orderBy?: string): Promise<AnnotationModel[]> {
    return this.getDb()
      .then((db: SQLiteObject) => {

        return <Promise<AnnotationModel[]>>this.db.executeSql(`
          SELECT id, title, content
          FROM annotations
          ORDER BY id ${orderBy || 'DESC'}
        `, {})
          .then((resultSet) => {
            let list: AnnotationModel[] = [];
            for (let i = 0; i < resultSet.rows.length; i++) {
              list.push(resultSet.rows.item(i));
            }
            return list;
          })
          .catch((error: Error) => console.log('Erro', error))
      })
  }

  public onSave(annotation: AnnotationModel): Promise<AnnotationModel> {
    return this.db.executeSql(`
    SELECT id, title, content
    FROM annotations
    WHERE id = ?
    `, [annotation.id])
      .then(resultSet => {
        if (resultSet.rows.item(0)) {
          this.update(annotation);
        } else {
          this.create(annotation);
        }
        return resultSet;
      })
      .catch((error: Error) => {
        console.log(`Erro ao criar '${annotation.title}' anotação!`, error)
        return annotation;
      });
  }

  public create(annotation: AnnotationModel): Promise<AnnotationModel> {
    return this.db.executeSql(`
        INSERT INTO annotations
        (title, content) VALUES (?,?)
      `, [
        annotation.title,
        annotation.content
      ])
      .then(resultSet => {
        annotation.id = resultSet.insertId;
        return annotation;
      })
      .catch((error: Error) => {
        console.log(`Erro ao criar '${annotation.title}' anotação!`, error)
        return annotation;
      });
  }

  public update(annotation: AnnotationModel): Promise<boolean> {
    return this.db.executeSql(`
      UPDATE annotations SET title = ?, content = ?
      WHERE id=?
      `   , [
        annotation.title,
        annotation.content,
        annotation.id
      ])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => {
        console.log(`Erro ao atualizar anotação!`, error)
        return false
      });
  }

  public delete(id: number): Promise<boolean> {
    return this.db.executeSql('DELETE FROM annotation WHERE id=?', [id])
      .then(resultSet => resultSet.rowsAffected >= 0)
      .catch((error: Error) => {
        console.log(`Erro ao deletar anotação!`, error)
        return false;
      });
  }

  public getById(id: number): Promise<AnnotationModel> {
    return this.db.executeSql(`
      SELECT id, title, content FROM annotations WHERE id=?
    `, [
        id
      ])
      .then(resultSet => {
        return resultSet.rows.item(0);
      })
      .catch((error: Error) => {
        console.log(`Erro ao encontrar anotação!`, error)
      });
  }
}
