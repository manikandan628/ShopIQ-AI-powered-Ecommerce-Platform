import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = () => {
  const { toasts } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach(toast => {
      setTimeout(() => dispatch(removeToast(toast.id)), 3000);
    });
  }, [toasts, dispatch]);

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            className={`toast ${toast.type || 'info'}`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
