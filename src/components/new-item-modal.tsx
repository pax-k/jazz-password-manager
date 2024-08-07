import React, { useState, useEffect } from "react";
import BaseModal from "./base-modal";
import Button from "./button";
import { PasswordItem } from "../schema";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PasswordItem) => void;
  folders: string[];
  editingItem: PasswordItem | null;
}

const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folders,
  editingItem,
}) => {
  const [item, setItem] = useState<PasswordItem>({
    name: "",
    username: "",
    password: "",
    uri: "",
    folder: folders[0] || "",
    deleted: false,
  });

  useEffect(() => {
    if (editingItem) {
      setItem(editingItem);
    } else {
      setItem({
        name: "",
        username: "",
        password: "",
        uri: "",
        folder: folders[0] || "",
        deleted: false,
      });
    }
  }, [editingItem, folders]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? "Edit Password" : "Add New Password"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={item.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={item.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={item.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="uri"
            className="block text-sm font-medium text-gray-700"
          >
            URI
          </label>
          <input
            type="url"
            name="uri"
            id="uri"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={item.uri}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="folder"
            className="block text-sm font-medium text-gray-700"
          >
            Folder
          </label>
          <select
            name="folder"
            id="folder"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={item.folder}
            onChange={handleChange}
          >
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editingItem ? "Update" : "Save"}</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default NewItemModal;
