import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SianDevTools } from './SianDevTools';
import type { UserContextType } from '../types/UserContextType';
import type { UserType } from '../types/UserType';

describe('SianDevTools Component', () => {
  const mockUser: UserType = {
    codfis: 'RSSMRA80A01H501J',
    mail: 'mario.rossi@example.com',
    givenname: 'Mario',
    sn: 'Rossi',
    telefono: '+39 123 456 7890',
    tipologiautente: 'Q',
    roles: ['admin', 'user'],
    sub: 'subject-123',
    iss: 'issuer-example',
    iat: 1609459200,
    exp: 1640995200,
    isForeign: false,
  };

  const mockSetUser = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps: React.ComponentProps<typeof SianDevTools> = {
    isOpen: true,
    onClose: mockOnClose,
    user: mockUser,
    setUser: mockSetUser,
    authInizialized: true,
    setAuthInizialized: jest.fn(),
    loadUser: jest.fn(),
    parseJwt: jest.fn(),
    lastAccessSaved: false,
    setLastAccessSaved: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal when isOpen is true', () => {
    render(<SianDevTools {...defaultProps} />);

    expect(screen.getByText('SIAN Dev Tools - Edit User')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <SianDevTools {...defaultProps} isOpen={false} />
    );

    expect(container.querySelector('.sian-dev-tools-form')).not.toBeInTheDocument();
  });

  it.only('should populate form fields with user data', () => {
    render(<SianDevTools {...defaultProps} />);

    expect(screen.getByDisplayValue('RSSMRA80A01H501J')).toBeInTheDocument();
    expect(screen.getByDisplayValue('mario.rossi@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rossi')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+39 123 456 7890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('subject-123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('issuer-example')).toBeInTheDocument();
  });

  it('should display roles as comma-separated values', () => {
    render(<SianDevTools {...defaultProps} />);

    const rolesTextarea = screen.getByPlaceholderText('role1, role2, role3');
    expect(rolesTextarea).toHaveValue('admin, user');
  });

  it('should update text input fields', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const firstNameInput = screen.getByDisplayValue('Mario');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Giuseppe');

    expect(firstNameInput).toHaveValue('Giuseppe');
  });

  it('should update email input field', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const emailInput = screen.getByDisplayValue('mario.rossi@example.com');
    await user.clear(emailInput);
    await user.type(emailInput, 'giuseppe.verdi@example.com');

    expect(emailInput).toHaveValue('giuseppe.verdi@example.com');
  });

  it('should handle roles textarea with comma-separated input', async () => {
    render(<SianDevTools {...defaultProps} />);

    const rolesTextarea = screen.getByPlaceholderText('role1, role2, role3') as HTMLTextAreaElement;
    act(() => {
      fireEvent.change(rolesTextarea, { target: { value: 'admin, editor, viewer' } });
      userEvent.type(rolesTextarea, 'admin, editor, viewer');
    });

    expect(rolesTextarea).toHaveValue('admin, editor, viewer');
  });

  it('should update user type (tipologiautente) via select dropdown', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const selectDropdown = screen.getByDisplayValue('Qualified User (Q)');
    await user.selectOptions(selectDropdown, 'I');

    expect(selectDropdown).toHaveValue('I');
  });

  it('should toggle isForeign checkbox', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const checkboxBefore = screen.getByLabelText('Is Foreign User') as HTMLInputElement;
    expect(checkboxBefore.checked).toBe(false);

    await user.click(checkboxBefore);

    const checkboxAfter = screen.getByLabelText('Is Foreign User') as HTMLInputElement;
    expect(checkboxAfter.checked).toBe(true);
  });

  it('should update numeric timestamp fields', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const iatInputs = screen.getAllByDisplayValue('1609459200');
    const iatInput = iatInputs[0];
    
    await user.clear(iatInput);
    await user.type(iatInput, '1609459300');

    expect(iatInput).toHaveValue(1609459300);
  });

  it('should call setUser with updated user data when Save is clicked', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const firstNameInput = screen.getByDisplayValue('Mario') as HTMLInputElement;
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Giuseppe');

    const lastNameInput = screen.getByDisplayValue('Rossi') as HTMLInputElement;
    await user.clear(lastNameInput);
    await user.type(lastNameInput, 'Verdi');

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled();
    });

    const callArgs = mockSetUser.mock.calls[0][0];
    expect(callArgs.givenname).toBe('Giuseppe');
    expect(callArgs.sn).toBe('Verdi');
  });

  it('should save updated roles as array when Save is clicked', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const rolesTextarea = screen.getByPlaceholderText('role1, role2, role3') as HTMLTextAreaElement;
    act(() => {
      fireEvent.change(rolesTextarea, { target: { value: 'superadmin, moderator, viewer' } });
    });

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled();
    });

    const callArgs = mockSetUser.mock.calls[0][0];
    expect(callArgs.roles).toEqual(['superadmin', 'moderator', 'viewer']);
  });

  it('should save updated user type when Save is clicked', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const selectDropdown = screen.getByDisplayValue('Qualified User (Q)');
    await user.selectOptions(selectDropdown, 'I');

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled();
    });

    const callArgs = mockSetUser.mock.calls[0][0];
    expect(callArgs.tipologiautente).toBe('I');
  });

  it('should save updated isForeign flag when Save is clicked', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const checkboxLabel = screen.getByLabelText('Is Foreign User');
    await user.click(checkboxLabel);

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled();
    });

    const callArgs = mockSetUser.mock.calls[0][0];
    expect(callArgs.isForeign).toBe(true);
  });

  it('should call onClose after Save is clicked', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should call onClose when Cancel is clicked without saving', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    const firstNameInput = screen.getByDisplayValue('Mario');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Giuseppe');

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('should reset form to original user data when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SianDevTools {...defaultProps} />);

    const firstNameInput = screen.getByDisplayValue('Mario') as HTMLInputElement;
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Giuseppe');

    expect(firstNameInput).toHaveValue('Giuseppe');

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    // Rerender with isOpen false then true to verify reset
    rerender(<SianDevTools {...defaultProps} isOpen={false} />);
    rerender(<SianDevTools {...defaultProps} isOpen={true} />);

    const resetFirstNameInput = screen.getByDisplayValue('Mario');
    expect(resetFirstNameInput).toBeInTheDocument();
  });

  it('should handle null user gracefully', () => {
    const { container } = render(
      <SianDevTools {...defaultProps} user={null} />
    );

    expect(container.querySelector('.sian-dev-tools-form')).toBeInTheDocument();
  });

  it('should update all fields and save the complete updated user object', async () => {
    const user = userEvent.setup();
    render(<SianDevTools {...defaultProps} />);

    // Update multiple fields
    const firstNameInput = screen.getByDisplayValue('Mario') as HTMLInputElement;
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Luigi');

    const emailInput = screen.getByDisplayValue('mario.rossi@example.com') as HTMLInputElement;
    await user.clear(emailInput);
    await user.type(emailInput, 'luigi.rossi@example.com');

    const rolesTextarea = screen.getByPlaceholderText('role1, role2, role3') as HTMLTextAreaElement;
    await user.clear(rolesTextarea);
  await user.type(rolesTextarea, 'admin, power-user');

    const selectDropdown = screen.getByDisplayValue('Qualified User (Q)');
    await user.selectOptions(selectDropdown, 'I');

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled();
    });

    const callArgs = mockSetUser.mock.calls[0][0];
    
    // Verify all changes were saved
    expect(callArgs.givenname).toBe('Luigi');
    expect(callArgs.mail).toBe('luigi.rossi@example.com');
    expect(callArgs.roles).toEqual(['admin', 'power-user']);
    expect(callArgs.tipologiautente).toBe('I');
    
    // Verify unchanged fields still exist
    expect(callArgs.codfis).toBe('RSSMRA80A01H501J');
    expect(callArgs.sn).toBe('Rossi');
    expect(callArgs.sub).toBe('subject-123');
  });
});
