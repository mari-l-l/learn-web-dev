export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2>ПРИНЦЕССА</h2>
            <p>Дружелюбное описание услуг</p>
          </div>
          <div className="footer-contacts">
            <h3>КОНТАКТЫ</h3>
            <p>ул. Садовая, 15, Москва</p>
            <p>+7 (495) 123-45-67</p>
          </div>
          <div className="footer-hours">
            <h3>РЕЖИМ РАБОТЫ</h3>
            <p>Пн-Пт: 9:00 – 21:00</p>
            <p>Сб-Вс: 10:00 – 19:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span> 2026. Все права защищены.</span>
          <a href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}