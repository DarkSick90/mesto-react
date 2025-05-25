import React from 'react';
import {useState} from "react";
// ...existing code imports...

import Profile from './Profile'
import Elements from "./Elements";
import PopupWindowProfile from "./PopupWindowProfile";
import PopupWindowImage from "./PopupWindowImage";
import PopupWindowAvatar from "./PopupWindowAvatar";
import PopupCardDelete from "./PopupCardDelete";
import PopupWindowBigImage from "./PopupWindowBigImage";

// Интерфейс для данных карточки
interface CardData {
    likes: Array<{ _id: string }>;
    link: string;
    name: string;
    owner: { _id: string; name: string; };
    _id: string;
}

function Main()  {
    // Состояние для массива карточек
    const [data, setData] = useState<CardData[]>([]);

    // Добавление новой карточки в начало массива
    const handleAddCard = (newCard: CardData) => {
        setData(prev => [newCard, ...prev]);
    };

    return (
        <main className="main">
            {/* Профиль пользователя */}
            <Profile onAddCard={handleAddCard}/>
            {/* Список карточек */}
            <Elements data={data} setData={setData} onAddCard={handleAddCard} />
        </main>
    );
}

export default Main;
