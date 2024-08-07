import { PasswordManagerRootAccount, PasswordItem, Folder } from "./schema";

export const mockData: PasswordManagerRootAccount = {
  folders: [
    {
      name: "Personal",
      items: [
        {
          name: "Gmail",
          username: "user@gmail.com",
          password: "password123",
          uri: "https://gmail.com",
          folder: "Personal",
          deleted: false,
        },
        {
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
      name: "Work",
      items: [
        {
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
