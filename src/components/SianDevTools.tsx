import React, { useState } from 'react';
import { Modal } from './Modal';
import type { UserContextType } from '../types/UserContextType';
import type { UserType } from '../types/UserType';

interface SianDevToolsProps extends UserContextType {
  /**
   * Whether the dev tools modal is open
   */
  isOpen: boolean;
  /**
   * Callback to close the dev tools modal
   */
  onClose: () => void;
}

/**
 * SianDevTools component for editing user properties in development
 */
export const SianDevTools: React.FC<SianDevToolsProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
}) => {
  const [formData, setFormData] = useState<Partial<UserType>>(user || {});

  // Convert formData whenever user changes
  React.useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.currentTarget;

    if (type === 'checkbox') {
      const checked = (e.currentTarget as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === 'roles') {
      // Convert comma-separated string to array
      const rolesArray = value
        .split(',')
        .map((role) => role.trim())
        .filter((role) => role.length > 0);
      setFormData((prev) => ({
        ...prev,
        roles: rolesArray,
      }));
    } else if (
      name === 'iat' ||
      name === 'exp'
    ) {
      // Handle numeric fields
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    if (formData) {
      setUser(formData as UserType);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form data to original user
    if (user) {
      setFormData(user);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="SIAN Dev Tools - Edit User"
      className="sian-dev-tools-modal"
    >
      <div className="sian-dev-tools-form">
        {/* Fiscal Code */}
        <div className="form-group">
          <label htmlFor="codfis">Fiscal Code</label>
          <input
            id="codfis"
            type="text"
            name="codfis"
            value={formData.codfis || ''}
            onChange={handleInputChange}
            placeholder="Fiscal code"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="mail">Email</label>
          <input
            id="mail"
            type="email"
            name="mail"
            value={formData.mail || ''}
            onChange={handleInputChange}
            placeholder="email@example.com"
          />
        </div>

        {/* Given Name */}
        <div className="form-group">
          <label htmlFor="givenname">Given Name (First Name)</label>
          <input
            id="givenname"
            type="text"
            name="givenname"
            value={formData.givenname || ''}
            onChange={handleInputChange}
            placeholder="First name"
          />
        </div>

        {/* Surname */}
        <div className="form-group">
          <label htmlFor="sn">Surname (Last Name)</label>
          <input
            id="sn"
            type="text"
            name="sn"
            value={formData.sn || ''}
            onChange={handleInputChange}
            placeholder="Last name"
          />
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="telefono">Phone Number</label>
          <input
            id="telefono"
            type="tel"
            name="telefono"
            value={formData.telefono || ''}
            onChange={handleInputChange}
            placeholder="+39 123 456 7890"
          />
        </div>

        {/* User Type */}
        <div className="form-group">
          <label htmlFor="tipologiautente">User Type</label>
          <select
            id="tipologiautente"
            name="tipologiautente"
            value={formData.tipologiautente || ''}
            onChange={handleInputChange}
          >
            <option value="">Select user type</option>
            <option value="Q">Qualified User (Q)</option>
            <option value="I">Institutional User (I)</option>
          </select>
        </div>

        {/* Roles */}
        <div className="form-group">
          <label htmlFor="roles">
            Roles (comma-separated)
          </label>
          <textarea
            id="roles"
            name="roles"
            value={(formData.roles || []).join(', ')}
            onChange={handleInputChange}
            placeholder="role1, role2, role3"
            rows={4}
          />
        </div>

        {/* Subject */}
        <div className="form-group">
          <label htmlFor="sub">Subject (sub)</label>
          <input
            id="sub"
            type="text"
            name="sub"
            value={formData.sub || ''}
            onChange={handleInputChange}
            placeholder="Subject identifier"
          />
        </div>

        {/* Issuer */}
        <div className="form-group">
          <label htmlFor="iss">Issuer (iss)</label>
          <input
            id="iss"
            type="text"
            name="iss"
            value={formData.iss || ''}
            onChange={handleInputChange}
            placeholder="Issuer identifier"
          />
        </div>

        {/* Issue At Timestamp */}
        <div className="form-group">
          <label htmlFor="iat">Issue At Timestamp (iat)</label>
          <input
            id="iat"
            type="number"
            name="iat"
            value={formData.iat || 0}
            onChange={handleInputChange}
            placeholder="Unix timestamp"
          />
        </div>

        {/* Expiration Timestamp */}
        <div className="form-group">
          <label htmlFor="exp">Expiration Timestamp (exp)</label>
          <input
            id="exp"
            type="number"
            name="exp"
            value={formData.exp || 0}
            onChange={handleInputChange}
            placeholder="Unix timestamp"
          />
        </div>

        {/* Is Foreign */}
        <div className="form-group checkbox">
          <input
            id="isForeign"
            type="checkbox"
            name="isForeign"
            checked={formData.isForeign || false}
            onChange={handleInputChange}
          />
          <label htmlFor="isForeign">Is Foreign User</label>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
