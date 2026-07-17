import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { useState } from "react";

import {

  AdminButton,

  AdminCard,

  AdminField,

  AdminInput,

  AdminPageHeader,

  AdminTextarea,

} from "@/components/AdminLayout";

import {
  createQuestion,
  deleteQuestion,
  saveLessonWithSections,
  saveStudyGuideWithDefinitions,
} from "@/lib/admin-api";

import { adminGetChapterFn } from "@/fns/admin.server";



export const Route = createFileRoute("/admin/chapters/$id")({

  loader: ({ params }) => adminGetChapterFn({ data: { id: params.id } }),

  component: AdminChapterEditor,

});



function linesToArray(text: string) {

  return text.split("\n").map((l) => l.trim()).filter(Boolean);

}



function arrayToLines(items: string[]) {

  return items.join("\n");

}



function AdminChapterEditor() {

  const chapter = Route.useLoaderData();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [msg, setMsg] = useState("");



  const lesson = chapter?.lesson;

  const guide = chapter?.studyGuide;



  const [lessonForm, setLessonForm] = useState({

    readingTime: lesson?.readingTime ?? 10,

    intro: lesson?.intro ?? "",

    summary: lesson?.summary ?? "",

    sections: lesson?.sections?.map((s) => ({ heading: s.heading, body: s.body })) ?? [{ heading: "", body: "" }],

  });



  const [guideForm, setGuideForm] = useState({

    keyConcepts: arrayToLines(guide?.keyConcepts ?? []),

    examTips: arrayToLines(guide?.examTips ?? []),

    commonMistakes: arrayToLines(guide?.commonMistakes ?? []),

    importantFacts: arrayToLines(guide?.importantFacts ?? []),

    definitions: guide?.definitions?.map((d) => ({ term: d.term, definition: d.definition })) ?? [{ term: "", definition: "" }],

  });



  const [newQuestion, setNewQuestion] = useState({

    question: "",

    options: ["", "", "", ""],

    correctIndex: 0,

    explanation: "",

  });



  if (!chapter) {

    return <div className="text-center text-muted-foreground py-12">Chapitre introuvable.</div>;

  }



  const saveLesson = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await saveLessonWithSections({

        chapterId: chapter.id,

        readingTime: lessonForm.readingTime,

        intro: lessonForm.intro,

        summary: lessonForm.summary,

        sections: lessonForm.sections.filter((s) => s.heading.trim()),

      });

      setMsg("Leçon enregistrée.");

      await router.invalidate();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Erreur");

    } finally {

      setLoading(false);

    }

  };



  const saveGuide = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await saveStudyGuideWithDefinitions({

        chapterId: chapter.id,

        keyConcepts: linesToArray(guideForm.keyConcepts),

        examTips: linesToArray(guideForm.examTips),

        commonMistakes: linesToArray(guideForm.commonMistakes),

        importantFacts: linesToArray(guideForm.importantFacts),

        definitions: guideForm.definitions.filter((d) => d.term.trim()),

      });

      setMsg("Fiche de révision enregistrée.");

      await router.invalidate();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Erreur");

    } finally {

      setLoading(false);

    }

  };



  const addQuestion = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    try {

      await createQuestion({

        chapterId: chapter.id,

        question: newQuestion.question,

        options: newQuestion.options.filter(Boolean),

        correctIndex: newQuestion.correctIndex,

        explanation: newQuestion.explanation,

        sortOrder: chapter.questions.length,

      });

      setNewQuestion({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" });

      await router.invalidate();

    } catch (err) {

      setError(err instanceof Error ? err.message : "Erreur");

    } finally {

      setLoading(false);

    }

  };



  const removeQuestion = async (id: string) => {

    if (!confirm("Supprimer cette question ?")) return;

    await deleteQuestion(id);

    await router.invalidate();

  };



  return (

    <div>

      <Link to="/admin/subjects/$id" params={{ id: chapter.subjectId }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">

        <ArrowLeft className="w-4 h-4" /> Retour à {chapter.subject.name}

      </Link>



      <AdminPageHeader title={chapter.title} subtitle={`${chapter.id} · ${chapter.duration} min`} />



      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      {msg && <p className="text-sm text-emerald-600 mb-3">{msg}</p>}



      <AdminCard className="mb-6">

        <h2 className="font-bold text-lg mb-4">Leçon</h2>

        <form onSubmit={saveLesson} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            <AdminField label="Temps de lecture (min)">

              <AdminInput type="number" value={lessonForm.readingTime} onChange={(e) => setLessonForm({ ...lessonForm, readingTime: Number(e.target.value) })} />

            </AdminField>

          </div>

          <AdminField label="Introduction"><AdminTextarea value={lessonForm.intro} onChange={(e) => setLessonForm({ ...lessonForm, intro: e.target.value })} /></AdminField>

          <AdminField label="Résumé"><AdminTextarea value={lessonForm.summary} onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })} /></AdminField>



          <div className="space-y-3">

            <div className="font-medium text-sm">Sections</div>

            {lessonForm.sections.map((s, i) => (

              <div key={i} className="grid gap-2 p-4 rounded-xl bg-muted/40 border border-border">

                <AdminInput value={s.heading} placeholder="Titre de section" onChange={(e) => {

                  const sections = [...lessonForm.sections];

                  sections[i] = { ...sections[i], heading: e.target.value };

                  setLessonForm({ ...lessonForm, sections });

                }} />

                <AdminTextarea value={s.body} placeholder="Contenu" onChange={(e) => {

                  const sections = [...lessonForm.sections];

                  sections[i] = { ...sections[i], body: e.target.value };

                  setLessonForm({ ...lessonForm, sections });

                }} />

              </div>

            ))}

            <AdminButton type="button" variant="outline" onClick={() => setLessonForm({ ...lessonForm, sections: [...lessonForm.sections, { heading: "", body: "" }] })}>

              <Plus className="w-4 h-4" /> Section

            </AdminButton>

          </div>



          <AdminButton type="submit" disabled={loading}>Enregistrer la leçon</AdminButton>

        </form>

      </AdminCard>



      <AdminCard className="mb-6">

        <h2 className="font-bold text-lg mb-4">Fiche de révision</h2>

        <form onSubmit={saveGuide} className="space-y-4">

          <AdminField label="Notions clés (une par ligne)">

            <AdminTextarea value={guideForm.keyConcepts} onChange={(e) => setGuideForm({ ...guideForm, keyConcepts: e.target.value })} rows={4} />

          </AdminField>

          <AdminField label="Conseils examen (une par ligne)">

            <AdminTextarea value={guideForm.examTips} onChange={(e) => setGuideForm({ ...guideForm, examTips: e.target.value })} rows={3} />

          </AdminField>

          <AdminField label="Erreurs fréquentes (une par ligne)">

            <AdminTextarea value={guideForm.commonMistakes} onChange={(e) => setGuideForm({ ...guideForm, commonMistakes: e.target.value })} rows={3} />

          </AdminField>

          <AdminField label="Faits importants (une par ligne)">

            <AdminTextarea value={guideForm.importantFacts} onChange={(e) => setGuideForm({ ...guideForm, importantFacts: e.target.value })} rows={3} />

          </AdminField>



          <div className="space-y-3">

            <div className="font-medium text-sm">Définitions</div>

            {guideForm.definitions.map((d, i) => (

              <div key={i} className="grid md:grid-cols-2 gap-2 p-4 rounded-xl bg-muted/40 border border-border">

                <AdminInput value={d.term} placeholder="Terme" onChange={(e) => {

                  const definitions = [...guideForm.definitions];

                  definitions[i] = { ...definitions[i], term: e.target.value };

                  setGuideForm({ ...guideForm, definitions });

                }} />

                <AdminInput value={d.definition} placeholder="Définition" onChange={(e) => {

                  const definitions = [...guideForm.definitions];

                  definitions[i] = { ...definitions[i], definition: e.target.value };

                  setGuideForm({ ...guideForm, definitions });

                }} />

              </div>

            ))}

            <AdminButton type="button" variant="outline" onClick={() => setGuideForm({ ...guideForm, definitions: [...guideForm.definitions, { term: "", definition: "" }] })}>

              <Plus className="w-4 h-4" /> Définition

            </AdminButton>

          </div>



          <AdminButton type="submit" disabled={loading}>Enregistrer la fiche</AdminButton>

        </form>

      </AdminCard>



      <AdminCard>

        <h2 className="font-bold text-lg mb-4">Questions quiz ({chapter.questions.length})</h2>



        <div className="space-y-3 mb-6">

          {chapter.questions.map((q, i) => (

            <div key={q.id} className="p-4 rounded-xl border border-border bg-muted/20">

              <div className="flex justify-between gap-4">

                <div>

                  <div className="text-xs text-muted-foreground mb-1">Question {i + 1}</div>

                  <div className="font-medium">{q.question}</div>

                  <ul className="text-sm mt-2 space-y-1">

                    {(q.options as string[]).map((opt, j) => (

                      <li key={j} className={j === q.correctIndex ? "text-emerald-600 font-medium" : "text-muted-foreground"}>

                        {String.fromCharCode(65 + j)}. {opt}

                      </li>

                    ))}

                  </ul>

                </div>

                <AdminButton variant="danger" onClick={() => removeQuestion(q.id)}><Trash2 className="w-4 h-4" /></AdminButton>

              </div>

            </div>

          ))}

        </div>



        <form onSubmit={addQuestion} className="space-y-4 border-t border-border pt-4">

          <h3 className="font-semibold">Nouvelle question</h3>

          <AdminField label="Énoncé"><AdminTextarea value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} required /></AdminField>

          {newQuestion.options.map((opt, i) => (

            <AdminField key={i} label={`Option ${String.fromCharCode(65 + i)}`}>

              <AdminInput value={opt} onChange={(e) => {

                const options = [...newQuestion.options];

                options[i] = e.target.value;

                setNewQuestion({ ...newQuestion, options });

              }} />

            </AdminField>

          ))}

          <AdminField label="Index bonne réponse (0-3)">

            <AdminInput type="number" min={0} max={3} value={newQuestion.correctIndex} onChange={(e) => setNewQuestion({ ...newQuestion, correctIndex: Number(e.target.value) })} />

          </AdminField>

          <AdminField label="Explication"><AdminTextarea value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} /></AdminField>

          <AdminButton type="submit" disabled={loading}><Plus className="w-4 h-4" /> Ajouter la question</AdminButton>

        </form>

      </AdminCard>

    </div>

  );

}

