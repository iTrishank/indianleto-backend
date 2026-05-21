import { Container } from "@/components/Container";
import { useApp } from "@/contexts/AppContext";
import aboutImage from "@assets/about.png";

// export default function About() {
//   const { t } = useApp();

//   return (
//     <Container className="py-8 md:py-12">
//       <div className="max-w-3xl mx-auto text-center">
//         <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="heading-about">
//           {t("header.aboutUs")}
//         </h1>
//         <p className="text-muted-foreground text-justify whitespace-pre-line" data-testid="text-about-placeholder">
//           {t("about.placeholder")}
//         </p>
//       </div>
//     </Container>
//   );
// }

export default function About() {
  const { t } = useApp();

  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen  "
      style={{
        backgroundImage: `url(${aboutImage})`,
      }}
    >
      <Container className="py-20 md:py-12">
        <div className="max-w-3xl mx-auto text-center bg-[#f03a3a]/30 p-6 rounded-xl backdrop-blur-[2px]">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white" data-testid="heading-about">
            {t("header.aboutUs")}
          </h1>

          <p className="text-white text-justify whitespace-pre-line" data-testid="text-about-placeholder">
            {t("about.placeholder")}
          </p>
        </div>
      </Container>
    </div>
  );
}
