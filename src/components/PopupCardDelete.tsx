import React from "react";
import popup__btn_close_img from "../images/Close-Icon.svg";

// Интерфейс для пропсов попапа удаления карточки
interface PopupCardDeleteProps {
    onDelete: () => void;
    onClose: () => void;
}

// Компонент попапа подтверждения удаления карточки
function PopupCardDelete ({ onDelete, onClose }: PopupCardDeleteProps) {
    // Обработка отправки формы (подтверждение удаления)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onDelete();
    };

    return (
        <section className="popup popup_card_delete" onClick={onClose}>
            <div className="popup__container" onClick={e => e.stopPropagation()}>
                <button type="button" className="popup__btn-close popup__image-btn-close"
                        aria-label="Кнопка закрытия" onClick={onClose}>
                    <img className="popup__btn-close-img" src={popup__btn_close_img}
                         alt="Кнопка закрытия"/></button>
                <h2 className="popup__title">Вы уверены?</h2>
                <form className="popup__form popup__form-delete" name="formDelet" noValidate onSubmit={handleSubmit}>
                    <input id="delete-image" type="submit" value="Да"
                           className="popup__button popup__btn-save popup__deletesubmit"/>
                </form>
            </div>
        </section>
    )
}

export default PopupCardDelete
