import React from "react";
import popup__btn_close_img from "../images/Close-Icon.svg";
import {useEscapeKey} from "../UserContext";

// Интерфейс для пропсов попапа большой картинки
interface PopupProps {
    name: string;
    image: string;
    isVisible: boolean;
    onClose: () => void;
}

const PopupWindowBigImage : React.FC<PopupProps> = ({name, image, isVisible, onClose}) => {

    // Закрытие по Escape
    useEscapeKey(isVisible, onClose);

    // Если попап не видим — не рендерим
    if (!isVisible) {
        return null;
    }

    // Остановка всплытия клика внутри попапа
    const handlePopupClick = (event: React.MouseEvent) => {event.stopPropagation()}

    return (
        <section className="popup popup_window_big-image" onClick={onClose}>
            <div className="popup__container popup__container_image" onClick={handlePopupClick}>
                <button type="button" className="popup__btn-close popup__big-image-btn-close"
                        aria-label="Кнопка закрытия" onClick={onClose}><img className="popup__btn-close-img"
                                                          src={popup__btn_close_img}
                                                          alt="Кнопка закрытия"/></button>
                <img className="popup__big-image-image" src={image} alt={name}/>
                <p className="popup__description">{name}</p>
            </div>
        </section>
    )
}

export default PopupWindowBigImage
