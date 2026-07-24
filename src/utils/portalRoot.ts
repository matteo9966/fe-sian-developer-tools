/**
 * Initialize and return the portal root element for modals
 * Creates a div with id "modal-root" at the top of the body if it doesn't exist
 */
export function getPortalRoot(): HTMLElement {
  let root = document.getElementById('modal-root');
  
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.insertBefore(root, document.body.firstChild);
  }
  
  return root;
}
