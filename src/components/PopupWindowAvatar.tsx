import React, {useEffect, useState} from "react";
import popup__btn_close_img from "../images/Close-Icon.svg";
import {useEscapeKey, useUser} from "../UserContext";
import axios from "axios";

// Интерфейс для пропсов попапа
interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
}

// Тип для данных формы
type FormData = {
    avatar: string;
};

const PopupWindowAvatar: React.FC<PopupProps> = ({ isVisible, onClose }) => {

    // Закрытие по Escape
    useEscapeKey(isVisible, onClose);

    // Получение и обновление пользователя из контекста
    const {user, setUser} = useUser();

    // Состояние для данных формы
    const [formData, setFormData] = useState<FormData>({ avatar: '' });

    // Обработка изменения поля формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Сброс формы при открытии попапа
    useEffect(() => {
        if (user) {
            setFormData({
                avatar: user.avatar || ''
            });
        }
    }, [user, isVisible]);

    // Если попап не видим — не рендерим
    if (!isVisible) {
        return null;
    }

    // Остановка всплытия клика внутри попапа
    const handlePopupClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    // Отправка формы (PATCH запрос)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                'https://mesto.nomoreparties.co/v1/cohort-64/users/me/avatar',
                {
                    avatar: formData.avatar
                },
                {
                    headers: {
                        authorization: 'f1dcddbe-9f41-4d4b-a5fb-88f41f215a01',
                        'Content-Type': 'application/json'
                    }
                }
            );
            setUser(response.data);
            console.log('Успешно обновлено:', response.data);
            onClose()
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    return (
        <section className="popup popup_window_avatar" onClick={onClose}>
            <div className="popup__container" onClick={handlePopupClick}>
                <button type="button" className="popup__btn-close popup__image-btn-close"
                        aria-label="Кнопка закрытия" onClick={onClose}>
                    <img className="popup__btn-close-img" src={popup__btn_close_img}
                         alt="Кнопка закрытия"/></button>
                <h2 className="popup__title">Обновить аватар</h2>
                <form className="popup__form popup__form-image" name="formAvatar" noValidate onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="avatar-url"
                            className="popup__input popup__input_image_link"
                            type="url"
                            name="avatar"
                            placeholder="Ссылка на картинку"
                            required
                            onChange={handleChange}
                            value={formData.avatar}
                        />
                        <span id="avatar-url-error" className="popup__input-error"></span>
                    </div>
                    <input id="save-avatar" type="submit" value="Создать"
                           className={`popup__button popup__btn-save`}  disabled={!formData.avatar}/>
                </form>
            </div>
        </section>
    )
}
export default PopupWindowAvatar
