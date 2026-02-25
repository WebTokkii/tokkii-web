import React, { useState, useEffect } from 'react';
import './Carousel.css';

const images = [
    `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Carrusel1.jpg`,
    `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Carrusel2.jpg`,
    `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Carrusel3.jpg`,
    `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Carrusel4.jpg`,
    `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Carrusel5.jpg`,
    `${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Carrusel6.jpg`,
];

const Carousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="carousel-section fade-in">
            <div className="container">
                <img src={`${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Separador.png`} alt="Separador" className="carousel-separator top" />
                <div className="carousel-wrapper">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                    <div className="carousel-overlay"></div>
                </div>
                <img src={`${import.meta.env.VITE_R2_BASE_URL}/Imagenes/Separador.png`} alt="Separador" className="carousel-separator bottom" />
            </div>
        </section>
    );
};

export default Carousel;
