import { useState } from 'react';
import Modal from 'react-modal';
import { ModalContext } from './ModalContext'; // Importa el contexto

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('alert');
  const [content, setContent] = useState({ title: "", content: "", onConfirm: null });

  const openModal = (modalContent, type = 'alert') => {
    return new Promise((resolve, reject) => {
      setContent({
        ...modalContent,
        onConfirm: () => {
          if (modalContent.onConfirm) modalContent.onConfirm();
          resolve(); // Resuelve la promesa cuando se confirma
        },
        onClose: () => {
          resolve(); // Resuelve la promesa cuando se cierra sin confirmar
        }
      });
      setModalType(type);
      setIsOpen(true);
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    if (content.onClose) content.onClose();
    setContent({ title: "", content: "", onConfirm: null });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        style={{
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '400px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">{content.title}</h2>
          <p>{content.content}</p>
          <div className="flex justify-center mt-8">
            {modalType === 'confirm' && (
              <button
                onClick={() => {
                  if (content.onConfirm) content.onConfirm();
                  closeModal();
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                Confirmar
              </button>
            )}
            <button onClick={closeModal} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
              {modalType === 'confirm' ? 'Cancelar' : 'Cerrar'}
            </button>
          </div>
        </div>
      </Modal>
    </ModalContext.Provider>
  );
};





