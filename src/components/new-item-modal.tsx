import React, { useState, useEffect } from "react";
import BaseModal from "./base-modal";
import Button from "./button";
// import { PasswordItem } from "../types";
import { Alert, AlertDescription } from "./alert";
import { Folder, PasswordItem } from "../schema";
import { CoMapInit } from "jazz-tools";
import { ID } from "jazz-tools";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  // editingItem, item
  initialValues?: CoMapInit<PasswordItem>;
  onSave: (item: CoMapInit<PasswordItem>) => void;
  folders: Folder[];
}

const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSave,
  folders,
}) => {
  const [item, setItem] = useState<Partial<CoMapInit<PasswordItem>>>(
    initialValues || {
      name: "",
      username: "",
      password: "",
      uri: "",
      deleted: false,
    }
  );
  useEffect(() => {
    if (!initialValues || !initialValues?.folder?.id) return;
    setItem(initialValues);
    setSelectedFolderId(initialValues?.folder?.id);
  }, [initialValues, initialValues?.folder?.id]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordItem, string>>
  >({});

  const [selectedFolderId, setSelectedFolderId] = useState(
    initialValues?.folder?.id || undefined
  );
  console.log("selectedFolderId", selectedFolderId);
  const selectedFolder = folders.find(
    (folder) => folder.id === selectedFolderId
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (
    item: Partial<CoMapInit<PasswordItem>>
  ): item is CoMapInit<PasswordItem> => {
    const newErrors: Partial<Record<keyof PasswordItem, string>> = {};

    if (!item.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!item.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (item.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (
      item.uri &&
      !item.uri.startsWith("http://") &&
      !item.uri.startsWith("https://")
    ) {
      newErrors.uri = "URI must start with http:// or https://";
    }

    if (!item.folder) {
      newErrors.folder = "Must select a folder";
    }

    setErrors(newErrors);
    console.log("errors", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (!selectedFolder) return;
    // const itemToUse = editingItem ?? item;
    // if (!editingItem) {
    item.folder = selectedFolder;
    // }
    if (validateForm(item)) {
      onSave(item);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialValues ? "Edit Password" : "Add New Password"}
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
          {errors.name && (
            <Alert variant="destructive">
              <AlertDescription>{errors.name}</AlertDescription>
            </Alert>
          )}
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
          {errors.password && (
            <Alert variant="destructive">
              <AlertDescription>{errors.password}</AlertDescription>
            </Alert>
          )}
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
          {errors.uri && (
            <Alert variant="destructive">
              <AlertDescription>{errors.uri}</AlertDescription>
            </Alert>
          )}
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
            value={item.folder?.id}
            onChange={(e) => setSelectedFolderId(e.target.value as ID<Folder>)}
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialValues ? "Update" : "Save"}</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default NewItemModal;
