import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/utils/auth/useAuth";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import useUser from "@/utils/useUser";
import { useNotifications } from "@/utils/useNotifications";
import { usePets, useAddPet, useUpdatePet } from "@/hooks/usePets";
import {
  usePetReminders,
  usePetAppointments,
  usePetHistory,
} from "@/hooks/usePetData";
import { usePetEdit } from "@/hooks/usePetEdit";
import { useFeedingSchedule } from "@/hooks/useFeedingSchedule";
import { useActivitySchedule } from "@/hooks/useActivitySchedule";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddPetCard } from "@/components/Veterinary/AddPetCard";
import { PetInfoCard } from "@/components/Veterinary/PetInfoCard";
import { RemindersSection } from "@/components/Veterinary/RemindersSection";
import { AppointmentsSection } from "@/components/Veterinary/AppointmentsSection";
import { MedicalHistorySection } from "@/components/Veterinary/MedicalHistorySection";
import { FeedingScheduleSection } from "@/components/Veterinary/FeedingScheduleSection";
import { FeedingModal } from "@/components/Veterinary/FeedingModal";
import { ActivityScheduleSection } from "@/components/Veterinary/ActivityScheduleSection";
import {
  WalkModal,
  ExerciseModal,
} from "@/components/Veterinary/ActivityModals";

export default function VeterinaryScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { auth } = useAuth();
  const { data: user } = useUser();
  const { expoPushToken } = useNotifications();
  const insets = useSafeAreaInsets();

  const { data: petsData, isLoading: petsLoading } = usePets(auth?.user?.id);
  const addPetMutation = useAddPet();
  const updatePetMutation = useUpdatePet();

  const selectedPet = petsData?.pets?.[0];

  const petEdit = usePetEdit(selectedPet);
  const { data: remindersData } = usePetReminders(selectedPet?.id);
  const { data: appointmentsData } = usePetAppointments(selectedPet?.id);
  const { data: historyData } = usePetHistory(selectedPet?.id);

  const feedingSchedule = useFeedingSchedule();
  const activitySchedule = useActivitySchedule();

  const handleSave = async () => {
    if (!petEdit.editedName.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    const dataToSave = petEdit.getEditedData();
    console.log("Guardando datos:", dataToSave);

    try {
      await updatePetMutation.mutateAsync(dataToSave);
      petEdit.setEditMode(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleCancelEdit = () => {
    petEdit.setEditMode(false);
    petEdit.resetEditedValues();
  };

  const header = (
    <AppHeader
      title="Salud Veterinaria"
      showBackButton={true}
      onBackPress={() => router.push("/(tabs)/home")}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 20,
      }}
    />
  );

  const isVetOrAdmin = user?.role === "veterinario" || user?.role === "admin";

  return (
    <AppScreen header={header}>
      {/* Add Pet Card */}
      {!selectedPet && (
        <AddPetCard
          onAdd={(petData) => addPetMutation.mutate(petData)}
          isAdding={addPetMutation.isPending}
        />
      )}

      {/* Pet Info Card */}
      {selectedPet && (
        <PetInfoCard
          pet={selectedPet}
          editMode={petEdit.editMode}
          onEditModeChange={(mode) => {
            if (!mode) {
              handleCancelEdit();
            } else {
              petEdit.setEditMode(mode);
            }
          }}
          editedValues={petEdit}
          onSave={handleSave}
          isSaving={updatePetMutation.isPending}
        />
      )}

      {/* Reminders Section */}
      {selectedPet && (
        <RemindersSection
          reminders={remindersData?.reminders}
          isVetOrAdmin={isVetOrAdmin}
          petId={selectedPet.id}
        />
      )}

      {/* Appointments Section */}
      {selectedPet && (
        <AppointmentsSection appointments={appointmentsData?.appointments} />
      )}

      {/* Medical History Section */}
      {selectedPet && historyData?.history?.length > 0 && (
        <MedicalHistorySection
          history={historyData.history}
          petId={selectedPet.id}
        />
      )}

      {/* Feeding Schedule Section */}
      {selectedPet && (
        <FeedingScheduleSection
          petName={selectedPet.name}
          schedules={feedingSchedule.feedingSchedules}
          onAddSchedule={() => feedingSchedule.setShowFeedingModal(true)}
          onRemoveSchedule={feedingSchedule.removeFeedingSchedule}
        />
      )}

      {/* Activity Schedule Section */}
      {selectedPet && (
        <ActivityScheduleSection
          petName={selectedPet.name}
          walkSchedules={activitySchedule.walkSchedules}
          exerciseSchedules={activitySchedule.exerciseSchedules}
          onAddWalk={() => activitySchedule.setShowWalkModal(true)}
          onAddExercise={() => activitySchedule.setShowExerciseModal(true)}
          onRemoveWalk={activitySchedule.removeWalkSchedule}
          onRemoveExercise={activitySchedule.removeExerciseSchedule}
        />
      )}

      {/* Feeding Modal */}
      <FeedingModal
        visible={feedingSchedule.showFeedingModal}
        onClose={() => feedingSchedule.setShowFeedingModal(false)}
        feedingTime={feedingSchedule.feedingTime}
        setFeedingTime={feedingSchedule.setFeedingTime}
        feedingMealType={feedingSchedule.feedingMealType}
        setFeedingMealType={feedingSchedule.setFeedingMealType}
        onSave={() => feedingSchedule.addFeedingSchedule(selectedPet?.name)}
      />

      {/* Walk Modal */}
      <WalkModal
        visible={activitySchedule.showWalkModal}
        onClose={() => activitySchedule.setShowWalkModal(false)}
        walkTime={activitySchedule.walkTime}
        setWalkTime={activitySchedule.setWalkTime}
        walkDuration={activitySchedule.walkDuration}
        setWalkDuration={activitySchedule.setWalkDuration}
        onSave={() => activitySchedule.addWalkSchedule(selectedPet?.name)}
      />

      {/* Exercise Modal */}
      <ExerciseModal
        visible={activitySchedule.showExerciseModal}
        onClose={() => activitySchedule.setShowExerciseModal(false)}
        exerciseTime={activitySchedule.exerciseTime}
        setExerciseTime={activitySchedule.setExerciseTime}
        exerciseType={activitySchedule.exerciseType}
        setExerciseType={activitySchedule.setExerciseType}
        onSave={() => activitySchedule.addExerciseSchedule(selectedPet?.name)}
      />
    </AppScreen>
  );
}
