import React from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import PopupWindowBigImage from "./PopupWindowBigImage";
import PopupCardDelete from "./PopupCardDelete";
import { useUser } from "../UserContext";

// Интерфейс для данных карточки
interface CardData {
    likes: Array<{ _id: string }>;
    link: string;
    name: string;
    owner: { _id: string; name: string; };
    _id: string;
}

// Интерфейс для пропсов компонента Elements
interface ElementsProps {
    data: CardData[];
    setData: React.Dispatch<React.SetStateAction<CardData[]>>;
    onAddCard: (newCard: CardData) => void;
}

function Elements({ data, setData }: ElementsProps) {
    // Состояния для выбранной карточки, попапа удаления и удаляемой карточки
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<CardData | null>(null);
    const { user } = useUser();

    // Загрузка карточек при первом рендере, если их нет
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<CardData[]>('https://mesto.nomoreparties.co/v1/cohort-64/cards', {
                    headers: {
                        authorization: 'f1dcddbe-9f41-4d4b-a5fb-88f41f215a01'
                    }
                });
                setData(response.data);
                console.log('Данные успешно загружены:', response.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        if (data.length === 0) {
            fetchData();
        }
    }, [setData, data.length]);

    // Открытие попапа с большой картинкой
    const handlePopupOpen = (card: CardData) => {
        setSelectedCard(card);
    };

    // Закрытие попапа с большой картинкой
    const handlePopupClose = () => {
        setSelectedCard(null);
    };

    // Открытие попапа удаления карточки
    const handleDeleteClick = (card: CardData) => {
        setCardToDelete(card);
        setIsDeletePopupOpen(true);
    };

    // Закрытие попапа удаления карточки
    const handleDeletePopupClose = () => {
        setIsDeletePopupOpen(false);
        setCardToDelete(null);
    };

    // Удаление карточки через API и обновление состояния
    const handleDelete = async () => {
        if (!cardToDelete) return;
        try {
            await axios.delete(
                `https://mesto.nomoreparties.co/v1/cohort-64/cards/${cardToDelete._id}`,
                {
                    headers: {
                        authorization: 'f1dcddbe-9f41-4d4b-a5fb-88f41f215a01'
                    }
                }
            );
            setData(prev => prev.filter(card => card._id !== cardToDelete._id));
            handleDeletePopupClose();
        } catch (error) {
            console.error('Ошибка при удалении карточки:', error);
        }
    };

    // Проверка, лайкнул ли пользователь карточку
    const isCardLikedByUser = (card: CardData) => {
        if (!user) return false;
        return card.likes.some(like => like._id === user._id);
    };

    // Обработка лайка/дизлайка карточки
    const handleLikeClick = async (card: CardData) => {
        if (!user) return;
        const liked = isCardLikedByUser(card);
        try {
            const url = `https://mesto.nomoreparties.co/v1/cohort-64/cards/${card._id}/likes`;
            const method = liked ? 'delete' : 'put';
            const response = await axios({
                method,
                url,
                headers: {
                    authorization: 'f1dcddbe-9f41-4d4b-a5fb-88f41f215a01'
                }
            });
            setData(prev =>
                prev.map(c => c._id === card._id ? { ...c, likes: response.data.likes } : c)
            );
        } catch (error) {
            console.error('Ошибка при изменении лайка:', error);
        }
    };

    return (
        <section className="elements">
            <ul className="elements__list">
                {data.map((item) => (
                    <li className="elements__element" key={item._id}>
                        {/* Кнопка удаления видна только владельцу карточки */}
                        {user && item.owner._id === user._id && (
                            <button
                                type="button"
                                className="elements__delete"
                                aria-label="кнопка удаления"
                                onClick={() => handleDeleteClick(item)}
                            ></button>
                        )}
                        {/* Картинка карточки */}
                        <img
                            className="elements__image"
                            src={item.link}
                            alt={item.name}
                            onClick={() => handlePopupOpen(item)}
                        />
                        <div className="elements__info">
                            <h2 className="elements__text">{item.name}</h2>
                            <div className="elements__like-container">
                                {/* Кнопка лайка, становится активной если пользователь лайкнул */}
                                <button
                                    type="button"
                                    className={`elements__like${isCardLikedByUser(item) ? " elements__like_active" : ""}`}
                                    aria-label="Значок сердечка"
                                    onClick={() => handleLikeClick(item)}
                                ></button>
                                <p className="elements__like-counte">{item.likes.length}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Попап с большой картинкой */}
            {selectedCard && (
                <PopupWindowBigImage
                    name={selectedCard.name}
                    image={selectedCard.link}
                    isVisible={true}
                    onClose={handlePopupClose}
                />
            )}

            {/* Попап подтверждения удаления карточки */}
            {isDeletePopupOpen && cardToDelete && (
                <PopupCardDelete
                    onDelete={handleDelete}
                    onClose={handleDeletePopupClose}
                />
            )}
        </section>
    );
}

export default Elements
