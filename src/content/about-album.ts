import acerLaptopRestored from "@/assets/about/acer-laptop-restored.jpg";
import corrodedMotherboard from "@/assets/about/corroded-motherboard.jpg";
import grengameFinalPresentation from "@/assets/about/grengame-final-presentation.jpg";
import grengamePresentationPortrait from "@/assets/about/grengame-presentation-portrait.jpg";
import hardwareWorkbench from "@/assets/about/hardware-workbench.jpg";
import residencyClassroom from "@/assets/about/residency-classroom.jpg";
import tic55ResidencyKit from "@/assets/about/tic55-residency-kit.jpg";
import unisinosCampus from "@/assets/about/unisinos-campus.jpg";
import unisinosPanel from "@/assets/about/unisinos-panel.jpg";
import type { Lang } from "@/i18n/dictionary";

type LocalizedText = Record<Lang, string>;

export type AboutAlbumPhoto = {
  id: string;
  src: string;
  width: 800;
  height: 1000;
  alt: LocalizedText;
  caption: LocalizedText;
};

const photo = (
  id: string,
  src: string,
  alt: LocalizedText,
  caption: LocalizedText,
): AboutAlbumPhoto => ({
  id,
  src,
  width: 800,
  height: 1000,
  alt,
  caption,
});

export const aboutAlbumPhotos: AboutAlbumPhoto[][] = [
  [
    photo(
      "unisinos-campus",
      unisinosCampus,
      {
        pt: "Fachada iluminada do Espaço Unisinos durante a noite.",
        en: "Illuminated facade of Espaço Unisinos at night.",
      },
      {
        pt: "Espaço Unisinos, parte da minha formação acadêmica.",
        en: "Espaço Unisinos, part of my academic journey.",
      },
    ),
    photo(
      "residency-classroom",
      residencyClassroom,
      {
        pt: "Encontro da Residência TIC55 em uma sala da Unisinos, com participantes trabalhando em notebooks.",
        en: "TIC55 Residency meeting in a Unisinos classroom, with participants working on laptops.",
      },
      {
        pt: "Atividade presencial durante a Residência TIC55.",
        en: "In-person activity during the TIC55 Residency.",
      },
    ),
    photo(
      "unisinos-panel",
      unisinosPanel,
      {
        pt: "Painel acadêmico no palco do Teatro Unisinos, acompanhado pela plateia.",
        en: "Academic panel on the Teatro Unisinos stage, watched by the audience.",
      },
      {
        pt: "Evento de apresentação inicial do programa de Residência em TIC 55 - Outubro/2025.",
        en: "Panel held at Teatro Unisinos.",
      },
    ),
    photo(
      "grengame-final-presentation",
      grengameFinalPresentation,
      {
        pt: "Equipe apresentando o projeto GrenGame a uma banca na Unisinos.",
        en: "Team presenting the GrenGame project to a panel at Unisinos.",
      },
      {
        pt: "Foto da transmissão online da apresentação final do GrenGame para a banca avaliadora. - Março/2026",
        en: "GrenGame project presentation to the evaluation panel.",
      },
    ),
    photo(
      "grengame-presentation-portrait",
      grengamePresentationPortrait,
      {
        pt: "Guilherme apresentando o projeto GrenGame com um microfone.",
        en: "Guilherme presenting the GrenGame project with a microphone.",
      },
      {
        pt: "Apresentação do GrenGame na etapa final da Residência TIC55. - Março/2026",
        en: "GrenGame presentation in the final stage of the TIC55 Residency.",
      },
    ),
  ],
  [
    photo(
      "hardware-workbench",
      hardwareWorkbench,
      {
        pt: "Dois notebooks desmontados durante uma manutenção feita em casa.",
        en: "Two disassembled laptops during maintenance at home.",
      },
      {
        pt: "Maio/2024 - Recuperação de Notebooks submersos na enchente.",
        en: "Technology is also learned by taking things apart, testing and trying again.",
      },
    ),
    photo(
      "corroded-motherboard",
      corrodedMotherboard,
      {
        pt: "Placa-mãe de notebook com grande acúmulo de oxidação após permanecer submersa na enchente.",
        en: "Laptop motherboard with heavy corrosion after being submerged in the flood.",
      },
      {
        pt: "Placa com grande acúmulo de oxidação de um dos notebooks recuperados após ficar submerso na enchente.",
        en: "Motherboard with heavy corrosion from one of the laptops recovered after being submerged in the flood.",
      },
    ),
    photo(
      "acer-laptop-restored",
      acerLaptopRestored,
      {
        pt: "Notebook Acer inicializando o Windows após a manutenção.",
        en: "Acer laptop starting Windows after maintenance.",
      },
      {
        pt: "Maio/2024 - Primeiro boot em um notebook recuperado.",
        en: "The laptop working again after maintenance.",
      },
    ),
  ],
  [],
  [
    photo(
      "tic55-residency-kit",
      tic55ResidencyKit,
      {
        pt: "Kit da Residência TIC55 com mochila, notebook, caderno e periféricos.",
        en: "TIC55 Residency kit with a backpack, laptop, notebook and peripherals.",
      },
      {
        pt: "Materiais recebidos durante a Residência TIC55.",
        en: "Materials received during the TIC55 Residency.",
      },
    ),
  ],
  [],
];

export const firstAboutAlbumImage = unisinosCampus;
