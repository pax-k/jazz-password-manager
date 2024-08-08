import React, { useState } from "react";
import Button from "../components/button";
import Table from "../components/table";
import NewItemModal from "../components/new-item-modal";
import InviteModal from "../components/invite-modal";
// import { PasswordItem } from "../types";
// import { flattenedItems, folderNames } from "../data";
import {
  saveItem,
  updateItem,
  deleteItem,
  createFolder,
  shareFolder,
  logout,
} from "../actions";
import { Alert, AlertDescription } from "../components/alert";
import SharePasswordModal from "../components/share-password-modal";
import { Folder, FolderList, PasswordItem } from "../schema";
import { useAccount, useCoState } from "../main";
import { CoMapInit } from "jazz-tools";

const VaultPage: React.FC = () => {
  const { me } = useAccount();
  // const [] = useCoState(FolderList, me.root?.folders?.id);
  const items = me.root?.folders?.flatMap(
    (folder) =>
      folder?.items?.filter(
        (item): item is Exclude<typeof item, null> => !!item
      ) || []
  );
  const folders = useCoState(FolderList, me.root?._refs.folders?.id, [
    { items: [{}] },
  ]);

  console.log("me", me);
  console.log("folders", folders);

  // const [items, setItems] = useState<PasswordItem[]>(me.root?.folders ?? []);
  // const [folders, setFolders] = useState<string[]>(folderNames);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSharePasswordModalOpen, setIsSharePasswordModalOpen] =
    useState(false);
  const [isNewFolderInputVisible, setIsNewFolderInputVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingItem, setEditingItem] = useState<PasswordItem | null>(null);
  const [sharingItem, setSharingItem] = useState<PasswordItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = selectedFolder
    ? items?.filter(
        (item) => item?.folder?.name === selectedFolder && !item.deleted
      )
    : items?.filter((item) => !item?.deleted);

  const handleSaveNewItem = async (newItem: CoMapInit<PasswordItem>) => {
    try {
      saveItem(newItem);
    } catch (err) {
      setError("Failed to save new item. Please try again.");
      throw new Error(err);
    }
  };

  const handleUpdateItem = async (updatedItem: CoMapInit<PasswordItem>) => {
    console.log("updatedItem", updatedItem);
    if (!editingItem) return;
    try {
      // TODO: apply diff to editedItem
      // for (const keyStr of Object.keys(editingItem)) {
      //   const key = keyStr as keyof CoMapInit<PasswordItem>;
      //   if (editingItem[key] !== updatedItem[key]) {
      //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //     (editingItem as any)[key] = updatedItem[key];
      //   }
      // }
      const res = editingItem.applyDiff(updatedItem);
      console.log("res", res);
      setEditingItem(null);
    } catch (err) {
      setError("Failed to update item. Please try again.");
      throw new Error(err);
    }
  };

  const handleDeleteItem = async (item: PasswordItem) => {
    try {
      await deleteItem(item);
      // setItems((prevItems) =>
      //   prevItems.map((i) => (i._id === item._id ? { ...i, deleted: true } : i))
      // );
    } catch (err) {
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName) {
      try {
        const newFolder = createFolder(newFolderName, me);
        // setFolders((prevFolders) => [...prevFolders, newFolder.name]);
        setNewFolderName("");
        setIsNewFolderInputVisible(false);
      } catch (err) {
        setError("Failed to create folder. Please try again.");
      }
    }
  };

  const handleShareFolder = async (folder: Folder, permission: string) => {
    try {
      const inviteLink = await shareFolder(folder.name, permission);
      console.log("Folder invite link created:", inviteLink);
    } catch (err) {
      setError("Failed to share folder. Please try again.");
    }
  };

  const handleShareItem = (item: PasswordItem) => {
    setSharingItem(item);
    setIsSharePasswordModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // The App component will automatically redirect to the login page
      // due to the useAuth hook
    } catch (err) {
      setError("Failed to logout. Please try again.");
    }
  };

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Username", accessor: "username" as const },
    { header: "URI", accessor: "uri" as const },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (item: PasswordItem) => (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigator.clipboard.writeText(item.password)}>
            Copy Password
          </Button>
          <Button onClick={() => setEditingItem(item)}>Edit</Button>
          <Button onClick={() => handleShareItem(item)} variant="secondary">
            Share
          </Button>
          <Button onClick={() => handleDeleteItem(item)} variant="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  console.log("editingItem", editingItem);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">Password Vault</h1>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {folders?.map((folder) => (
            <Button
              // key={folder}
              onClick={() => setSelectedFolder(folder?.name)}
              variant={
                selectedFolder === folder?.name ? "primary" : "secondary"
              }
            >
              {folder?.name}
            </Button>
          ))}
          {isNewFolderInputVisible ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <Button onClick={handleCreateFolder}>Save</Button>
            </div>
          ) : (
            <Button onClick={() => setIsNewFolderInputVisible(true)}>
              New Folder
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsNewItemModalOpen(true)}>New Item</Button>
          <Button onClick={() => setIsInviteModalOpen(true)}>Share</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table data={filteredItems} columns={columns} />
      </div>
      {folders ? (
        <NewItemModal
          isOpen={isNewItemModalOpen || !!editingItem}
          onClose={() => {
            setIsNewItemModalOpen(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleUpdateItem : handleSaveNewItem}
          folders={folders}
          // editingItem={editingItem}
          initialValues={
            editingItem && editingItem.folder ? { ...editingItem } : undefined
          }
        />
      ) : null}

      {folders ? (
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          folders={folders}
          onInvite={handleShareFolder}
        />
      ) : null}
      <SharePasswordModal
        isOpen={isSharePasswordModalOpen}
        onClose={() => {
          setIsSharePasswordModalOpen(false);
          setSharingItem(null);
        }}
        passwordItem={sharingItem}
      />
    </div>
  );
};

export default VaultPage;
