"use state";
import { useState } from "react";
import { SkillCard } from "./skill-card";
import { Droppable } from "./droppable";
import { CreateUserSkillDialog } from "./create-user-skill-dialog";
import { Skill, Skills, UserSkills } from "@/lib/types";
import { toast } from "sonner";
import { Proficiency } from "@/lib/types";
import { useCreateUserSkill } from "@/hooks/users";

type KanbanColumnProps = {
  level: Proficiency;
  droppableId: string;
  userSkills: UserSkills;
  textColor: string;
  availableSkills: Skills;
};

export default function KanbanColumn({
  level,
  droppableId,
  userSkills,
  textColor,
  availableSkills,
}: KanbanColumnProps) {
  const { mutateAsync: createUserSkill } = useCreateUserSkill();
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [proficiency, setProficiency] = useState<Proficiency>(level);

  const handleCreateUserSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!selectedSkill) {
        toast.error("Failed to create user skill. Please select a skill.");
        return;
      }
      await createUserSkill({ user_id: userSkills[0].user, skill_id: selectedSkill.id, proficiency: proficiency });
      setOpen(false);
      setSelectedSkill(null);
      setProficiency(level);
      toast.success(`Successfully created: ${selectedSkill.name} ${proficiency}`);
    } catch {
      toast.error("Failed to create user skill");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCloseDialog();
    } else {
      setOpen(isOpen);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedSkill(null);
    setProficiency(level);
  };

  return (
    <Droppable id={droppableId} className="bg-muted rounded-xl p-4 shadow-sm mt-5">
      <h2 className={`text-xl font-semibold mb-4 flex items-center justify-between ${textColor}`}>
        {level}
        <CreateUserSkillDialog
          onSubmit={handleCreateUserSkill}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          level={proficiency}
          setProficiency={setProficiency}
          open={open}
          setOpen={setOpen}
          onOpenChange={handleOpenChange}
          onClose={handleCloseDialog}
          availableSkills={availableSkills}
        />
      </h2>
      <div className="space-y-3 flex flex-col">
        {userSkills
          .filter((us) => us.proficiency === level)
          .map((us) => (
            <SkillCard
              key={us.id}
              id={us.id}
              skillName={us.skill.name}
              proficiency={us.proficiency}
              created_at={us.created_at}
            />
          ))}
      </div>
    </Droppable>
  );
}
