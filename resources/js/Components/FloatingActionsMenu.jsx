import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MoreVertical, Pencil, Trash2, Circle } from 'lucide-react';

export default function FloatingActionsMenu({
  event,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'floating-menu-portal';
    document.body.appendChild(container);
    setPortalContainer(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // ✅ FIX: capture the event prop from closure
  const handleAction = (callback) => () => {
    callback(event);   // ← now passes the real event data
    closeMenu();
  };

  if (!portalContainer) return null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Event actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen &&
        createPortal(
          <Menu as="div" className="fixed z-50" static>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              show={isOpen}
            >
              <Menu.Items
                static
                className="w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                style={{
                  position: 'fixed',
                  left: buttonRef.current
                    ? buttonRef.current.getBoundingClientRect().right - 192
                    : 0,
                  top: buttonRef.current
                    ? buttonRef.current.getBoundingClientRect().bottom + 4
                    : 0,
                }}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleAction(onStatusChange)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                    >
                      <Circle className="mr-2 h-4 w-4" />
                      Change Status
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleAction(onEdit)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Event
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleAction(onDelete)}
                      disabled={isDeleting}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-red-600 disabled:opacity-50`}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>,
          portalContainer
        )}
    </>
  );
}
