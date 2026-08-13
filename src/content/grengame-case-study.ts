import grengamePresentationPortrait from "@/assets/about/grengame-presentation-portrait.jpg";
import residencyClassroom from "@/assets/about/residency-classroom.jpg";
import grengameNavigation from "@/assets/projects/grengame-navigation.jpg";
import grengamePasswordReset from "@/assets/projects/grengame-password-reset.jpg";

export const GRENGAME_DEMO_URL = "https://tic55-grengame-showcase.pages.dev/login";

export const grengameCaseMedia = {
  classroom: {
    src: residencyClassroom,
    width: 800,
    height: 1000,
  },
  passwordReset: {
    src: grengamePasswordReset,
    width: 1280,
    height: 800,
  },
  navigation: {
    src: grengameNavigation,
    width: 800,
    height: 1000,
  },
  presentation: {
    src: grengamePresentationPortrait,
    width: 800,
    height: 1000,
  },
} as const;
