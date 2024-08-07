import { PasswordManagerRootAccount, PasswordItem } from "./types";

export const mockData: PasswordManagerRootAccount = {
  folders: [
    {
      _id: "folder1",
      name: "Personal",
      items: [
        {
          _id: "item1",
          name: "Gmail",
          username: "user@gmail.com",
          password: "password123",
          uri: "https://gmail.com",
          folder: "Personal",
          deleted: false,
        },
        {
          _id: "item2",
          name: "Facebook",
          username: "user@facebook.com",
          password: "facebookpass",
          uri: "https://facebook.com",
          folder: "Personal",
          deleted: false,
        },
      ],
    },
    {
      _id: "folder2",
      name: "Work",
      items: [
        {
          _id: "item3",
          name: "Company Email",
          username: "user@company.com",
          password: "companypass",
          uri: "https://company.com/email",
          folder: "Work",
          deleted: false,
        },
      ],
    },
  ],
};

export const flattenedItems: PasswordItem[] = mockData.folders.flatMap(
  (folder) => folder.items.map((item) => ({ ...item, folder: folder.name }))
);

export const folderNames: string[] = mockData.folders.map(
  (folder) => folder.name
);
