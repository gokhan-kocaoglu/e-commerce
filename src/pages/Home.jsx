import HeroSlider from "../components/HeroSlider";
import EditorsPick from "../components/EditorsPick";
import BestSellers from "../components/BestSellers";
import PromoSlider from "../components/Slider";
import CtaSection from "../components/CtaSection";
import FeaturedPosts from "../components/FeaturedPosts";
import { fetchHomeSlidersApi } from "../services/sliderService";
import { fetchActiveCampaignsApi } from "../services/campaignService";
import { adaptCampaignsToPromoItems } from "../adapters/promoAdapter";
import { useEffect, useState, useCallback } from "react";

import StatusGate from "../components/common/StatusGate";
import HeroSliderSkeleton from "../components/common/HeroSliderSkeleton";
import ErrorBanner from "../components/common/ErrorBanner";

export default function Home() {
  // HERO
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed

  // PROMO
  const [promoItems, setPromoItems] = useState([]);
  const [promoStatus, setPromoStatus] = useState("idle");
  const [promoError, setPromoError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const list = await fetchHomeSlidersApi();
      setItems(list);
      setStatus("succeeded");
    } catch {
      setStatus("failed");
    }
  }, []);

  // HERO fetch (ilk yükleme)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatus("loading");
      try {
        const list = await fetchHomeSlidersApi();
        if (mounted) {
          setItems(list);
          setStatus("succeeded");
        }
      } catch {
        if (mounted) setStatus("failed");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // PROMO fetch (BE → adapter → UI model)
  useEffect(() => {
    const controller = new AbortController();
    setPromoStatus("loading");
    setPromoError(null);

    (async () => {
      try {
        const raw = await fetchActiveCampaignsApi({
          signal: controller.signal,
        });
        const mapped = adaptCampaignsToPromoItems(raw);
        setPromoItems(mapped);
        setPromoStatus("succeeded");
      } catch (err) {
        if (controller.signal.aborted) return;
        setPromoError(
          err?.response?.data?.message ||
            err?.message ||
            "Kampanyalar yüklenemedi."
        );
        setPromoStatus("failed");
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <section>
      {/* HERO: status'a göre */}
      <StatusGate
        status={status}
        loadingFallback={
          <HeroSliderSkeleton heightClass="h-[420px] sm:h-[480px] md:h-[640px]" />
        }
        errorFallback={
          <ErrorBanner message="Slider verisi yüklenemedi." onRetry={load} />
        }
      >
        <HeroSlider
          items={items}
          autoPlayDelay={6000}
          heightClass="h-[420px] sm:h-[480px] md:h-[640px]"
        />
      </StatusGate>

      {/* Diğer bölümler */}
      <EditorsPick />
      <BestSellers limit={8} />

      {/* PROMO: BE’den gelen kampanyalar */}
      <StatusGate
        status={promoStatus}
        loadingFallback={
          <div className="h-[360px] md:h-[640px] bg-zinc-100 animate-pulse rounded" />
        }
        errorFallback={
          <ErrorBanner
            message={promoError || "Kampanyalar yüklenemedi."}
            onRetry={() => {
              // tek seferlik basit retry
              const controller = new AbortController();
              setPromoStatus("loading");
              fetchActiveCampaignsApi({ signal: controller.signal })
                .then((raw) => adaptCampaignsToPromoItems(raw))
                .then(setPromoItems)
                .then(() => setPromoStatus("succeeded"))
                .catch((err) => {
                  if (controller.signal.aborted) return;
                  setPromoError(err?.response?.data?.message || err?.message);
                  setPromoStatus("failed");
                });
            }}
          />
        }
      >
        <PromoSlider
          items={promoItems}
          heightClass="h-auto md:h-[640px]"
          autoPlayDelay={6000}
        />
      </StatusGate>

      <CtaSection slug="neural-universe" className="my-0.5" />
      <FeaturedPosts className="py-16 md:py-20" />
    </section>
  );
}
