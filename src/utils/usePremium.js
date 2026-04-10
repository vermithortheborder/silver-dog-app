import { useCallback, useEffect } from "react";
import { create } from "zustand";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PRODUCT_CATEGORY } from "react-native-purchases";
import { useAuth } from "@/utils/auth/useAuth";

// Store global para premium
const usePremiumStore = create((set) => ({
  isPremium: false,
  isLoading: true,
  offerings: null,
  isPurchasing: false,
  setIsPremium: (isPremium) => set({ isPremium }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setOfferings: (offerings) => set({ offerings }),
  setIsPurchasing: (isPurchasing) => set({ isPurchasing }),
}));

export function usePremium() {
  const { auth, isReady: authReady } = useAuth();
  const {
    isPremium,
    isLoading,
    offerings,
    isPurchasing,
    setIsPremium,
    setIsLoading,
    setOfferings,
    setIsPurchasing,
  } = usePremiumStore();

  // Inicializar RevenueCat
  const initializePurchases = useCallback(async () => {
    if (!authReady) return;

    try {
      Purchases.setLogLevel(LOG_LEVEL.INFO);

      const apiKey =
        process.env.EXPO_PUBLIC_CREATE_ENV === "DEVELOPMENT"
          ? process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY
          : Platform.select({
              ios: process.env.EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY,
              android: process.env.EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY,
              web: process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY,
            });

      if (apiKey) {
        await Purchases.configure({ apiKey });

        // Si hay usuario, identificarlo
        if (auth?.user?.id) {
          await Purchases.logIn(auth.user.id.toString());
        }

        // Obtener offerings
        const availableOfferings = await Purchases.getOfferings();
        setOfferings(availableOfferings);

        // Verificar estado de suscripción
        await checkPremiumStatus();
      } else {
        console.warn("RevenueCat API key not configured");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error initializing purchases:", error);
      setIsLoading(false);
    }
  }, [auth, authReady]);

  // Verificar estado premium
  const checkPremiumStatus = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasPremium =
        typeof customerInfo.entitlements.active["premium_member"] !==
        "undefined";
      setIsPremium(hasPremium);
      setIsLoading(false);
      return hasPremium;
    } catch (error) {
      console.error("Error checking premium status:", error);
      setIsPremium(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  // Comprar suscripción
  const purchaseSubscription = useCallback(
    async (packageToPurchase) => {
      if (!auth?.user?.id) {
        throw new Error("Usuario no autenticado");
      }

      try {
        setIsPurchasing(true);
        const { customerInfo } =
          await Purchases.purchasePackage(packageToPurchase);
        const hasPremium =
          typeof customerInfo.entitlements.active["premium_member"] !==
          "undefined";
        setIsPremium(hasPremium);
        return hasPremium;
      } catch (error) {
        if (error.userCancelled) {
          console.log("Usuario canceló la compra");
        } else {
          console.error("Error purchasing subscription:", error);
        }
        throw error;
      } finally {
        setIsPurchasing(false);
      }
    },
    [auth],
  );

  // Restaurar compras
  const restorePurchases = useCallback(async () => {
    try {
      setIsPurchasing(true);
      const customerInfo = await Purchases.restorePurchases();
      const hasPremium =
        typeof customerInfo.entitlements.active["premium_member"] !==
        "undefined";
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (error) {
      console.error("Error restoring purchases:", error);
      throw error;
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  // Obtener paquetes disponibles
  const getAvailablePackages = useCallback(() => {
    if (!offerings?.current) {
      return [];
    }
    return offerings.current.availablePackages.filter(
      (pkg) => pkg.product.productCategory === PRODUCT_CATEGORY.SUBSCRIPTION,
    );
  }, [offerings]);

  useEffect(() => {
    if (authReady) {
      initializePurchases();
    }
  }, [authReady, initializePurchases]);

  return {
    isPremium,
    isLoading,
    isPurchasing,
    offerings,
    purchaseSubscription,
    restorePurchases,
    checkPremiumStatus,
    getAvailablePackages,
  };
}

export default usePremium;
