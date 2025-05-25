import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Интерфейс для данных пользователя
export interface UserData {
    name: string;
    about: string;
    avatar: string;
    _id: string;
    cohort: string;
}

// Интерфейс для контекста пользователя
interface UserContextType {
    user: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

// Интерфейс для пропсов попапа
interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
}

// Создание контекста пользователя
const UserContext = createContext<UserContextType | undefined>(undefined);

// Провайдер контекста пользователя
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);

    // Загрузка данных пользователя при монтировании компонента
    useEffect(() => {
        axios.get<UserData>('https://mesto.nomoreparties.co/v1/cohort-64/users/me', {
            headers: {
                authorization: 'f1dcddbe-9f41-4d4b-a5fb-88f41f215a01'
            }
        })
            .then(response => setUser(response.data))
            .catch(error => console.error('Ошибка при загрузке пользователя:', error));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Хук для доступа к контексту пользователя
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Хук для закрытия попапа по клавише Escape
export function useEscapeKey (isVisible: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isVisible) return;

        const handleEscClose = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscClose);

        return () => {
            document.removeEventListener('keydown', handleEscClose);
        };
    }, [isVisible, onClose]);
}

// Кастомный хук для валидации форм
export function useFormValidation(initialValues: {[key: string]: string}) {
    const [values, setValues] = useState(initialValues); // значения полей формы
    const [errors, setErrors] = useState<{[key: string]: string}>({}); // ошибки валидации
    const [isValid, setIsValid] = useState(false); // валидность всей формы

    // Обработчик изменения полей формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, validity, validationMessage, form } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: !validity.valid ? validationMessage : "" }));
        setIsValid(form ? form.checkValidity() : false);
    };

    // Сброс формы к начальному состоянию
    const resetForm = (newValues = initialValues) => {
        setValues(newValues);
        setErrors({});
        setIsValid(true);
    };

    return { values, errors, isValid, handleChange, resetForm };
}
