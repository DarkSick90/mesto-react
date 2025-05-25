import React, {useEffect} from 'react';
import {useState} from "react";
import profile__avatar_edit from "../images/Avatar-edit.png";
import profile__edit_button from "../images/Edit-Button.svg";
import add_Button from "../images/Add-Button.svg";
import {useEscapeKey, useUser} from "../UserContext";

// ...existing css imports...

import PopupWindowProfile from "./PopupWindowProfile";
import PopupWindowAvatar from "./PopupWindowAvatar";
import PopupWindowImage from "./PopupWindowImage";
import axios from "axios";

// Интерфейс для данных карточки
interface CardData {
    likes: Array<{ _id: string }>;
    link: string;
    name: string;
    owner: { _id: string; name: string; };
    _id: string;
}

// Интерфейс для пропсов компонента Profile
interface ProfileProps {
    onAddCard: (newCard: CardData) => void;
}

const Profile: React.FC<ProfileProps> = ({onAddCard}) => {

    // Состояния для видимости попапов
    const [isPopupProfileVisible, setIsPopupProfileVisible] = useState(false);
    const [isPopupAvatarVisible, setIsPopupAvatarVisible] = useState(false);
    const [isPopupImageVisible, setIsPopupImageVisible] = useState(false);

    // Открытие/закрытие попапа профиля
    const handleButtonClickProfile = () => {
        setIsPopupProfileVisible(true);
    };
    const handleClosePopupProfile = () => {
        setIsPopupProfileVisible(false);
    };

    // Открытие/закрытие попапа аватара
    const handleButtonClickAvatar = () => {
        setIsPopupAvatarVisible(true);
    };
    const handleClosePopupAvatar = () => {
        setIsPopupAvatarVisible(false);
    };

    // Открытие/закрытие попапа добавления карточки
    const handleButtonClickImage = () => {
        setIsPopupImageVisible(true);
    };
    const handleClosePopupImage = () => {
        setIsPopupImageVisible(false);
    };

    // Интерфейс для данных пользователя (для справки)
    interface UserData {
        name: string;
        about: string;
        avatar: string;
        _id: string;
        cohort: string;
    }

    // Получение пользователя из контекста
    const { user: data } = useUser();

    return (
        <section className="profile" aria-label="Проиль пользователя">
            {/* Аватар пользователя */}
            <img className="profile__avatar" src={data?.avatar} alt="Аватар"/>
            <div className="profile__avatar-edit-container">
                <img className="profile__avatar-edit" src={profile__avatar_edit} alt="" onClick={handleButtonClickAvatar}/>
            </div>
            <div className="profile__info">
                {/* Имя пользователя */}
                <h1 className="profile__name">{data?.name}</h1>
                {/* Кнопка редактирования профиля */}
                <button type="button" className="profile__edit-button" aria-label="Кнопка редактиования профиля"
                        onClick={handleButtonClickProfile}>
                    <img
                        className="profile__edit-button-img" src={profile__edit_button}
                        alt="Кнопка редактиования профиля"/></button>
                {/* О себе */}
                <p className="profile__name-info">{data?.about}</p>
            </div>
            {/* Кнопка добавления карточки */}
            <button type="button" className="profile__add-button" aria-label="Кнопка добавления картинок" onClick={handleButtonClickImage}><img
                src={add_Button} alt="Кнопка добавления картинок"/></button>
            {/* Попапы */}
            {isPopupProfileVisible && (<PopupWindowProfile isVisible={isPopupProfileVisible} onClose={handleClosePopupProfile}/>)}
            {isPopupAvatarVisible && (<PopupWindowAvatar isVisible={isPopupAvatarVisible} onClose={handleClosePopupAvatar}/>)}
            {isPopupImageVisible && (<PopupWindowImage isVisible={isPopupImageVisible} onClose={handleClosePopupImage} onAddCard={onAddCard}/>)}
        </section>
    )
}

export default Profile
