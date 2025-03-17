"use client";

export default function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <footer className="flex w-full text-center items-center flex-row justify-around bg-[#4D2900] text-white">
      <div className="flex w-full text-[1.2rem] items-center flex-row justify-center">
        <img src="/logo.png" alt="Logo" className="w-[50px] h-auto" />
        <strong>Bookstore</strong>
      </div>
      <div className="w-px bg-white h-[100px]"></div>
      <div className="w-[30%]">
        <a onClick={scrollToTop} className="cursor-pointer">
          <strong>Voltar ao topo</strong>
        </a>
      </div>
    </footer>
  );
}
