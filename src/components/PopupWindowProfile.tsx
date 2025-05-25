import React from "react";
import {useState, useEffect} from "react";
import axios from "axios";
import {useUser, useEscapeKey, useFormValidation} from "../UserContext";
import popup__btn_close_img from "../images/Close-Icon.svg";

// Интерфейс для пропсов попапа профиля
interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
}

// Компонент попапа редактирования профиля пользователя
const PopupWindowProfile: React.FC<PopupProps> = ({ isVisible, onClose }) => {

    // Закрытие по Escape
    useEscapeKey(isVisible, onClose);

    // Получение и обновление пользователя из контекста
    const {user, setUser} = useUser();

    // Хук для валидации формы
    const { values, errors, isValid, handleChange, resetForm } = useFormValidation({ name: "", about: "" });

    // Сброс формы при открытии попапа
    useEffect(() => {
        if (user && isVisible) {
            resetForm({ name: user.name || "", about: user.about || "" });
        }
    }, [user, isVisible]);

    // Если попап не видим — не рендерим
    if (!isVisible) {
        return null;
    }

    // Остановка всплытия клика внутри попапа
    const handlePopupClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    // Отправка формы (PATCH запрос)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                'https://mesto.nomoreparties.co/v1/cohort-64/users/me',
                {
                    name: values.name,
                    about: values.about
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

    // Разметка попапа
    return (
        <section className="popup popup_window_profile" onClick={onClose}>
            <div className="popup__container" onClick={handlePopupClick}>
                <button type="button" className="popup__btn-close popup__profile-btn-close"
                        aria-label="Кнопка закрытия" onClick={onClose}><img className="popup__btn-close-img"
                                                          src={popup__btn_close_img}
                                                          alt="Кнопка закрытия"/></button>
                <h2 className="popup__title">Редактировать профиль</h2>
                <form className="popup__form popup__form-info" name="formInfo" noValidate onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="user-name"
                            className="popup__input popup__input_info_name"
                            type="text"
                            name="name"
                            placeholder="Имя"
                            value={values.name || ""}
                            onChange={handleChange}
                            minLength={2}
                            required
                        />
                        <span id="user-name-error" className="popup__input-error">{errors.name}</span>

                        <input
                            id="user-job"
                            className="popup__input popup__input_info_job"
                            type="text"
                            name="about"
                            placeholder="О себе"
                            value={values.about || ""}
                            onChange={handleChange}
                            minLength={2}
                            required
                        />
                        <span id="user-job-error" className="popup__input-error">{errors.about}</span>
                    </div>
                    <input
                        id="save-profile"
                        type="submit"
                        value="Сохранить"
                        className={`popup__button popup__btn-save${!isValid ? " popup__btn-save_disabled" : ""}`}
                    />
                </form>
            </div>
        </section>
    )
}

export default PopupWindowProfile
