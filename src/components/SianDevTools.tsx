import React, { useState } from 'react';
import { Modal } from './Modal';
import type { UserContextType } from '../types/UserContextType';
import type { UserType } from '../types/UserType';
import './SianDevTools.css';

interface SianDevToolsProps extends UserContextType {}

type TabType = 'user-editor' | 'jwt-decoder';

/**
 * SianDevTools component for editing user properties in development
 */
export const SianDevTools: React.FC<SianDevToolsProps> = ({
  user,
  setUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('user-editor');
  const [formData, setFormData] = useState<Partial<UserType>>(user || {});
  const [jwtToken, setJwtToken] = useState('');
  const [decodedPayload, setDecodedPayload] = useState<Record<string, any> | null>(null);
  const [decodingError, setDecodingError] = useState('');

  // Convert formData whenever user changes
  React.useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user, isOpen]);

  // Handle keyboard shortcuts: Ctrl+Shift+O to open, Ctrl+Shift+C to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === 'O' || e.key === 'o') {
          e.preventDefault();
          setIsOpen(true);
        } else if (e.key === 'C' || e.key === 'c') {
          e.preventDefault();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Decode JWT token and convert timestamps to Italian date format
   */
  const decodeJWT = (token: string) => {
    try {
      setDecodingError('');
      const parts = token.trim().split('.');
      
      if (parts.length !== 3) {
        setDecodingError('Invalid JWT format. JWT should have 3 parts separated by dots.');
        setDecodedPayload(null);
        return;
      }

      // Decode the payload (second part)
      const payload = parts[1];
      // Add padding if necessary
      const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      const decodedStr = atob(paddedPayload);
      const parsed = JSON.parse(decodedStr);

      // Convert timestamps to Italian date format
      const processedPayload = { ...parsed };
      
      if (processedPayload.exp) {
        const expDate = new Date(processedPayload.exp * 1000);
        processedPayload.exp_formatted = expDate.toLocaleString('it-IT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        });
      }

      if (processedPayload.iat) {
        const iatDate = new Date(processedPayload.iat * 1000);
        processedPayload.iat_formatted = iatDate.toLocaleString('it-IT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        });
      }

      setDecodedPayload(processedPayload);
    } catch (error) {
      setDecodingError(`Failed to decode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setDecodedPayload(null);
    }
  };

  const handleJwtTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const token = e.target.value;
    setJwtToken(token);
    if (token.trim()) {
      decodeJWT(token);
    } else {
      setDecodedPayload(null);
      setDecodingError('');
    }
  };

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
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    // Reset form data to original user
    if (user) {
      setFormData(user);
    }
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="SIAN Dev Tools"
      className="sian-dev-tools-modal"
    >
      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          <button
            className={`tab-button ${activeTab === 'user-editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('user-editor')}
          >
            User Editor
          </button>
          <button
            className={`tab-button ${activeTab === 'jwt-decoder' ? 'active' : ''}`}
            onClick={() => setActiveTab('jwt-decoder')}
          >
            JWT Decoder
          </button>
        </div>

        {/* User Editor Tab */}
        {activeTab === 'user-editor' && (
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
        )}

        {/* JWT Decoder Tab */}
        {activeTab === 'jwt-decoder' && (
          <div className="jwt-decoder-form">
            {/* JWT Token Input */}
            <div className="form-group">
              <label htmlFor="jwtToken">JWT Token</label>
              <textarea
                id="jwtToken"
                value={jwtToken}
                onChange={handleJwtTokenChange}
                placeholder="Paste your JWT token here..."
                rows={6}
                className="jwt-input"
              />
              <p className="jwt-hint">Paste a complete JWT token (including all 3 parts separated by dots)</p>
            </div>

            {/* Error Message */}
            {decodingError && (
              <div className="error-message">
                <strong>Error:</strong> {decodingError}
              </div>
            )}

            {/* Decoded Payload */}
            {decodedPayload && (
              <div className="decoded-payload">
                <h3>Decoded Payload</h3>
                <div className="payload-content">
                  {Object.entries(decodedPayload).map(([key, value]) => (
                    <div key={key} className="payload-item">
                      <div className="payload-key">{key}</div>
                      <div className="payload-value">
                        {typeof value === 'object' ? (
                          <code>{JSON.stringify(value, null, 2)}</code>
                        ) : (
                          <code>{String(value)}</code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

