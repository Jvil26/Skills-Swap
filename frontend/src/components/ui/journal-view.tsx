"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { extractYouTubeId } from "@/lib/utils";
import Image from "next/image";
import { useCreateJournal, useFetchJournalById, useUpdateJournalById } from "@/hooks/journals";

type JournalViewProps = {
  isNew?: boolean;
  journalId: number;
  userSkillId: number;
};
export default function JournalView({ isNew, journalId, userSkillId }: JournalViewProps) {
  const { data: journal } = useFetchJournalById(journalId, { enabled: !isNew && !!journalId });
  const [title, setTitle] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [youtubeURL, setYoutubeURL] = useState<string>("");
  const { mutateAsync: createJournal } = useCreateJournal(userSkillId);
  const { mutateAsync: updateJournalById } = useUpdateJournalById(userSkillId);

  useEffect(() => {
    if (journal) {
      setTitle(journal.title || "");
      setTextContent(journal.text_content || "");
      setYoutubeURL(journal.youtube_url || "");
    }
  }, [journal]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title, textContent, youtubeURL);
    if (!title) {
      toast.error("Failed to journal. Title cannot be empty");
      return;
    }
    if (!textContent) {
      toast.error("Failed to journal. Content cannot be empty");
      return;
    }
    if (youtubeURL) {
      const url = youtubeURL.trim().toLowerCase();
      if (url && !url.includes("youtube.com") && !url.includes("youtu.be")) {
        toast.error("Failed to journal. Please provide a valid YouTube link or upload a file.");
        return;
      }
    }
    const formData = new FormData();
    formData.append("user_skill", String(userSkillId));
    formData.append("title", title);
    formData.append("text_content", textContent);
    if (media) formData.append("media", media);
    if (youtubeURL) formData.append("youtube_url", youtubeURL);
    try {
      console.log(Object.fromEntries(formData.entries()));
      if (isNew) {
        await createJournal(formData);
      } else {
        await updateJournalById({ id: journalId, journalData: formData });
      }
      toast.success("Journal saved successfully!");
      // TODO: send formData to backend with fetch or axios
      console.log("Saving journal:", Object.fromEntries(formData.entries()));
    } catch {
      toast.error("Failed to save journal.");
    }
  };

  return (
    <div className="min-h-screen bg-muted pt-[calc(var(--nav-height))] p-1 sm:p-10">
      <h1 className="text-[3rem] mt-5 font-bold text-center underline underline-offset-12">{isNew && "New"} Journal</h1>
      <form onSubmit={(e) => handleSave(e)} className="flex flex-col gap-y-7">
        <div>
          <Label className="pb-1 text-[1.8rem]">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="!text-[1.8rem] py-6 sm:py-8 md:py-10 font-bold"
          />
        </div>

        <div>
          <Label className="pb-1 text-[1.8rem]">Content</Label>
          <Textarea
            id="text-content"
            rows={6}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="!text-[1.1rem] min-h-60"
          />
        </div>

        <div>
          <Label className="pb-1 text-[1.8rem]">Upload Media</Label>
          <Input type="file" id="media" accept="image/*,video/*" onChange={handleMediaChange} />
          <div className="flex justify-center">
            {journal?.media ? (
              journal.media.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={journal.media} controls className="w-full h-64 rounded-md my-5" />
              ) : (
                <div className="relative w-full max-w-[800px] h-50 sm:h-100 my-5">
                  <Image
                    src={journal.media}
                    alt="Uploaded media"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 800px"
                    className="rounded-md object-contain"
                  />
                </div>
              )
            ) : null}
          </div>
        </div>
        <div>
          <Label className="pb-1 text-[1.8rem]">Youtube URL</Label>
          <Input
            id="youtube-url"
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            className="!text-[1rem] mb-5 font-bold py-5"
            placeholder="Paste Youtube URL Here"
          />
          {youtubeURL && (
            <div className="flex justify-center">
              <iframe
                className="w-full lg:w-1/2 h-110 rounded-md border-4 border-border outline outline-1 outline-white"
                src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeURL)}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center mt-5">
          <Button className="text-[1rem] p-5" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
