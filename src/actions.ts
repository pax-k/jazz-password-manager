import { PasswordItem } from "./schema";
import { mockData, flattenedItems } from "./data";

export const saveItem = (item: PasswordItem): Promise<PasswordItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const folder = mockData.folders.find((f) => f.name === item.folder);
      if (folder) {
        folder.items.push(item);
      } else {
        mockData.folders.push({ name: item.folder, items: [item] });
      }
      resolve(item);
    }, 500);
  });
};

export const updateItem = (item: PasswordItem): Promise<PasswordItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const folder = mockData.folders.find((f) => f.name === item.folder);
      if (folder) {
        const index = folder.items.findIndex((i) => i.name === item.name);
        if (index !== -1) {
          folder.items[index] = item;
          resolve(item);
        } else {
          reject(new Error("Item not found"));
        }
      } else {
        reject(new Error("Folder not found"));
      }
    }, 500);
  });
};

export const deleteItem = (item: PasswordItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const folder = mockData.folders.find((f) => f.name === item.folder);
      if (folder) {
        const index = folder.items.findIndex((i) => i.name === item.name);
        if (index !== -1) {
          folder.items.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Item not found"));
        }
      } else {
        reject(new Error("Folder not found"));
      }
    }, 500);
  });
};

export const createFolder = (folderName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockData.folders.some((f) => f.name === folderName)) {
        reject(new Error("Folder already exists"));
      } else {
        mockData.folders.push({ name: folderName, items: [] });
        resolve();
      }
    }, 500);
  });
};

export const shareFolder = (
  folderName: string,
  permission: string
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would generate a unique invite link
      const inviteLink = `https://example.com/invite?folder=${folderName}&permission=${permission}`;
      resolve(inviteLink);
    }, 500);
  });
};
