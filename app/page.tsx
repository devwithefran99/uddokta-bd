import HeroSection from "@/components/home/HeroSection";
import ImpactStats from "@/components/home/ImpactStats";
import RecentEvents from "@/components/home/RecentEvents";
import GallerySection from "@/components/home/GallerySection";


const page = () => {
  return (
    <div>
        <HeroSection />
           <ImpactStats />
            <RecentEvents /> 

            <GallerySection />
    </div>
  );
};

export default page;