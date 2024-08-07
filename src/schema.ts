import { Account, co, CoList, CoMap, Profile } from "jazz-tools";

export class PasswordItem extends CoMap {
  name = co.string;
  username = co.optional.string;
  username_input_selector = co.optional.string;
  password = co.string;
  password_input_selector = co.optional.string;
  uri = co.optional.string;
  folder = co.string;
}

export class PasswordList extends CoList.Of(co.ref(PasswordItem)) {}

export class Folder extends CoMap {
  name = co.string;
  items = co.ref(PasswordList);
}

export class FolderList extends CoList.Of(co.ref(Folder)) {}

export class PasswordManagerRootAccount extends CoMap {
  folders = co.ref(FolderList);
}

export class PasswordManagerAccount extends Account {
  profile = co.ref(Profile);
  root = co.ref(PasswordManagerRootAccount);

  migrate(this: PasswordManagerAccount, creationProps?: { name: string }) {
    super.migrate(creationProps);
    if (!this._refs.root) {
      this.root = PasswordManagerRootAccount.create(
        {
          folders: FolderList.create([], {
            owner: this,
          }),
        },
        { owner: this }
      );
    }
  }
}
