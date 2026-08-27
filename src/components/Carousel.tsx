import React, { useState, useEffect } from 'react';
import './Carousel.css';

const images = [
    `/Imagenes/Carrusel1.jpg`,
    `/Imagenes/Carrusel2.jpg`,
    `/Imagenes/Carrusel3.jpg`,
    `/Imagenes/Carrusel4.jpg`,
    `/Imagenes/Carrusel5.jpg`,
    `/Imagenes/Carrusel6.jpg`,
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
                <img src={`/Imagenes/Separador.png`} alt="Separador" className="carousel-separator top" />
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
                <img src={`/Imagenes/Separador.png`} alt="Separador" className="carousel-separator bottom" />
            </div>
        </section>
    );
};

export default Carousel;
