import {existsSync, readFileSync, writeFileSync} from 'node:fs';

export function createStore(path) {
  if(!existsSync(path)) {
    writeFileSync(path, JSON.stringify([], null, 2), 'utf-8');
  } 

  return {
    get: () => {
      const textContent = readFileSync(path, 'utf-8');
      return JSON.parse(textContent);
    },
    set: (newData) => {
      writeFileSync(path, JSON.stringify(newData, null, 2), 'utf-8');
    },
    delete: (dataToDelete) => {
      const textContent = readFileSync(path, 'utf-8');
      const data = JSON.parse(textContent);

      const newData = data.filter((item) => item.id != dataToDelete.id);

      writeFileSync(path, JSON.stringify(newData, null, 2), 'utf-8');
    }
  }
}