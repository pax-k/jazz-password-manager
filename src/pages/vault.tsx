import React, { useState, useEffect } from "react";
import Button from "../components/button";
import Table from "../components/table";
import NewItemModal from "../components/new-item-modal";
import InviteModal from "../components/invite-modal";
import { PasswordItem } from "../schema";
import { flattenedItems, folderNames } from "../mock-data";
import {
  saveItem,
  updateItem,
  deleteItem,
  createFolder,
  shareFolder,
  shareItem,
} from "../actions";

const VaultPage: React.FC = () => {
  const [items, setItems] = useState<PasswordItem[]>(flattenedItems);
  const [folders, setFolders] = useState<string[]>(folderNames);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isNewFolderInputVisible, setIsNewFolderInputVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingItem, setEditingItem] = useState<PasswordItem | null>(null);

  const filteredItems = selectedFolder
    ? items.filter((item) => item.folder === selectedFolder && !item.deleted)
    : items.filter((item) => !item.deleted);

  const handleSaveNewItem = async (newItem: PasswordItem) => {
    const savedItem = await saveItem(newItem);
    setItems([...items, savedItem]);
  };

  const handleUpdateItem = async (updatedItem: PasswordItem) => {
    const updated = await updateItem(updatedItem);
    setItems(
      items.map((item) => (item.name === updated.name ? updated : item))
    );
    setEditingItem(null);
  };

  const handleDeleteItem = async (item: PasswordItem) => {
    await deleteItem(item);
    setItems(items.map((i) => (i === item ? { ...i, deleted: true } : i)));
  };

  const handleCreateFolder = async () => {
    if (newFolderName) {
      await createFolder(newFolderName);
      setFolders([...folders, newFolderName]);
      setNewFolderName("");
      setIsNewFolderInputVisible(false);
    }
  };

  const handleShareFolder = async (folderName: string, permission: string) => {
    const inviteLink = await shareFolder(folderName, permission);
    console.log("Folder invite link created:", inviteLink);
  };

  const handleShareItem = async (item: PasswordItem, permission: string) => {
    const inviteLink = await shareItem(item, permission);
    console.log("Item invite link created:", inviteLink);
  };

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Username", accessor: "username" as const },
    { header: "URI", accessor: "uri" as const },
    {
      header: "Actions",
      accessor: "name" as const,
      render: (item: PasswordItem) => (
        <div className="space-x-2">
          <Button onClick={() => navigator.clipboard.writeText(item.password)}>
            Copy Password
          </Button>
          <Button onClick={() => setEditingItem(item)}>Edit</Button>
          <Button
            onClick={() => handleShareItem(item, "reader")}
            variant="secondary"
          >
            Share
          </Button>
          <Button onClick={() => handleDeleteItem(item)} variant="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Password Vault</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          {folders.map((folder) => (
            <Button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              variant={selectedFolder === folder ? "primary" : "secondary"}
            >
              {folder}
            </Button>
          ))}
          {isNewFolderInputVisible ? (
            <div className="inline-block">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border rounded px-2 py-1 mr-2"
              />
              <Button onClick={handleCreateFolder}>Save</Button>
            </div>
          ) : (
            <Button onClick={() => setIsNewFolderInputVisible(true)}>
              New Folder
            </Button>
          )}
        </div>
        <div className="space-x-2">
          <Button onClick={() => setIsNewItemModalOpen(true)}>New Item</Button>
          <Button onClick={() => setIsInviteModalOpen(true)}>Share</Button>
        </div>
      </div>
      <Table data={filteredItems} columns={columns} />
      <NewItemModal
        isOpen={isNewItemModalOpen || !!editingItem}
        onClose={() => {
          setIsNewItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={editingItem ? handleUpdateItem : handleSaveNewItem}
        folders={folders}
        editingItem={editingItem}
      />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        folders={folders}
        onInvite={handleShareFolder}
      />
    </div>
  );
};

export default VaultPage;
