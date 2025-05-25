import React, {useEffect, useState} from "react";
import popup__btn_close_img from "../images/Close-Icon.svg";
import {useEscapeKey, useFormValidation, useUser} from "../UserContext";
import axios from "axios";

// Интерфейс для данных карточки
interface CardData {
    likes: Array<{ _id: string }>;
    link: string;
    name: string;
    owner: { _id: string; name: string; };
    _id: string;
}

// Интерфейс для пропсов попапа добавления карточки
interface PopupProps {
    isVisible: boolean;
    onClose: () => void;
    onAddCard: (card: CardData) => void;
}

const PopupWindowImage : React.FC<PopupProps> = ({isVisible, onClose, onAddCard})  => {

    // Закрытие по Escape
    useEscapeKey(isVisible, onClose);

    // Хук для валидации формы
    const { values, errors, isValid, handleChange, resetForm } = useFormValidation({ name: "", link: "" });

    // Сброс формы при открытии попапа
    useEffect(() => {
        if (isVisible) {
            resetForm({ name: "", link: "" });
        }
    }, [isVisible]);

    // Если попап не видим — не рендерим
    if (!isVisible) {
        return null;
    }

    // Остановка всплытия клика внутри попапа
    const handlePopupClick = (event: React.MouseEvent) => {event.stopPropagation()}

    // Отправка формы (POST запрос на создание карточки)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(values.name, values.link)
            const response = await axios.post<CardData>(
                'https://mesto.nomoreparties.co/v1/cohort-64/cards',
                {
                    name: values.name,
                    link: values.link
                },
                {
                    headers: {
                        authorization: 'f1dcddbe-9f41-4d4b-a5fb-88f41f215a01',
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Успешно обновлено:', response.data);
            onAddCard(response.data);
            onClose()
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    return (
        <section className="popup popup_window_image" onClick={onClose}>
            <div className="popup__container" onClick={handlePopupClick}>
                <button type="button" className="popup__btn-close popup__image-btn-close"
                        aria-label="Кнопка закрытия" onClick={onClose}>
                    <img className="popup__btn-close-img" src={popup__btn_close_img}
                         alt="Кнопка закрытия"/></button>
                <h2 className="popup__title">Новое место</h2>
                <form className="popup__form popup__form-image" name="formImage" noValidate onSubmit={handleSubmit}>
                    <div>
                        <input id="card-name" className="popup__input popup__input_image_name " type="text"
                               name="name"
                               value={values.name || ""}
                               placeholder="Название" required onChange={handleChange} minLength={2}/>
                        <span id="card-name-error" className="popup__input-error">{errors.name}</span>
                        <input id="card-url" className="popup__input popup__input_image_link " type="url"
                               name="link"
                               value={values.link || ""}
                               placeholder="Ссылка на картинку" required onChange={handleChange} minLength={2}/>
                        <span id="card-url-error" className="popup__input-error">{errors.link}</span>
                    </div>
                    <input id="save-image" type="submit" value="Создать"
                           className={`popup__button popup__btn-save${!isValid ? " popup__btn-save_disabled" : ""}`}/>
                </form>
            </div>
        </section>
    )
}

export default PopupWindowImage
