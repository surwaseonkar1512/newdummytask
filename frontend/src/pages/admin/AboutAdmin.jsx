import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { Loader2, ChevronRight, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { aboutApi } from '../../api/aboutApi';
import GalleryModal from '../../components/admin/GalleryModal';

const ImagePicker = ({ name, label }) => {
  const { watch, setValue } = useFormContext();
  const [showGallery, setShowGallery] = useState(false);
  const currentImage = watch(name);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => setShowGallery(true)}
        className={`relative w-full max-w-sm h-48 rounded-xl border-2 border-dashed ${!currentImage?.url ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50' : 'border-purple-200'} flex items-center justify-center cursor-pointer overflow-hidden transition-colors bg-gray-50`}
      >
        {currentImage?.url ? (
          <img src={currentImage.url} alt="Selection" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <ImageIcon size={32} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Select Image</span>
          </div>
        )}
      </div>
      <GalleryModal isOpen={showGallery} onClose={() => setShowGallery(false)} onSelect={(img) => {
        setValue(name, { url: img.url, publicId: img.publicId }, { shouldValidate: true });
        setShowGallery(false);
      }} />
    </div>
  );
};

// --- STEPS ---

const Step1Hero = () => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Hero & Intro Section</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading (Title) *</label>
        <input {...register('hero.title', { required: 'Title is required' })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none" placeholder="e.g. About Our Studio" />
        {errors.hero?.title && <p className="text-red-500 text-xs mt-1">{errors.hero.title.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input {...register('hero.subtitle')} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none" placeholder="e.g. Crafting Legacies in Stone" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Intro Text</label>
        <textarea {...register('hero.introText')} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none" placeholder="Short introductory paragraph shown on the hero header..." />
      </div>
      <ImagePicker name="hero.backgroundImage" label="Hero Background Image" />
    </div>
  );
};

const Step2Story = () => {
  const { register, formState: { errors } } = useFormContext();
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Studio Story</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Story Heading *</label>
        <input {...register('story.heading', { required: 'Heading is required' })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none" placeholder="e.g. Our Heritage" />
        {errors.story?.heading && <p className="text-red-500 text-xs mt-1">{errors.story.heading.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Story Paragraph (Rich Text)</label>
        <textarea {...register('story.paragraph')} rows="8" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-200 outline-none" placeholder="Tell the full story of your studio here..." />
      </div>
      <ImagePicker name="story.image" label="Story Master Image" />
    </div>
  );
};

const Step3Journey = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'journey' });

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Journey & Timeline</h2>
      <p className="text-sm text-gray-500 mb-4">Build an infinite vertical timeline showing the history of your studio.</p>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex gap-6 relative group">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Year / Event Title</label>
              <input {...register(`journey.${index}.title`)} placeholder="e.g. 2015 – Workshop Founded" className="w-full bg-white px-4 py-2 mt-1 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
              <textarea {...register(`journey.${index}.description`)} rows="2" placeholder="Describe the milestone..." className="w-full bg-white px-4 py-2 mt-1 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
            <ImagePicker name={`journey.${index}.image`} label="Timeline Image (Optional)" />
          </div>
          <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-white p-2 rounded-full shadow-sm"><Trash2 size={18} /></button>
        </div>
      ))}

      <button type="button" onClick={() => append({ title: '', description: '', image: null })} className="w-full py-4 border-2 border-dashed border-purple-300 text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-colors flex items-center justify-center">
        <Plus size={20} className="mr-2" /> Add Timeline Milestone
      </button>
    </div>
  );
};

const Step4Team = () => {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'team' });

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Core Team Roster</h2>
      <p className="text-sm text-gray-500 mb-4">Add your master artisans, founders, and key team members.</p>

      {errors.team?.root && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-200 mb-4">{errors.team.root.message}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl relative">
            <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-full"><Trash2 size={16} /></button>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Name *</label>
                <input {...register(`team.${index}.name`, { required: 'Name is required' })} placeholder="e.g. Ramesh Sculptor" className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Role / Title</label>
                <input {...register(`team.${index}.role`)} placeholder="e.g. Master Carver" className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Quote / Thoughts</label>
                <textarea {...register(`team.${index}.thoughts`)} rows="2" placeholder="e.g. Art breathes life into stone." className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">LinkedIn URL</label>
                  <input {...register(`team.${index}.socialLinks.linkedin`)} className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 outline-none text-xs" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Instagram URL</label>
                  <input {...register(`team.${index}.socialLinks.instagram`)} className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 outline-none text-xs" />
                </div>
              </div>
              <div className="pt-2"><ImagePicker name={`team.${index}.image`} label="Profile Photo" /></div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => append({ name: '', role: '', thoughts: '', socialLinks: {} })} className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center">
        <Plus size={20} className="mr-2" /> Add Team Member
      </button>
    </div>
  );
};

const Step5Vision = () => {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'vision.points' });

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">Vision & Values</h2>
      <ImagePicker name="vision.image" label="Vision Master Image" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Core Pillars (Bullet Points) *</label>
        {errors.vision?.points?.root && <p className="text-red-500 text-sm mb-3 font-bold">{errors.vision.points.root.message}</p>}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <input {...register(`vision.points.${index}.value`)} placeholder="e.g. Preserve Indian heritage through art" className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200" />
              <button type="button" onClick={() => remove(index)} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => append({ value: '' })} className="mt-4 flex items-center px-4 py-2 text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 border-dashed">
          <Plus size={16} className="mr-2" /> Add Value Point
        </button>
      </div>
    </div>
  );
};

const STEPS = ['Hero & Intro', 'Our Story', 'Timeline Journey', 'Core Team', 'Vision & Values'];

// --- MAIN WIZARD COMPONENT ---

const AboutAdmin = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const methods = useForm({
    defaultValues: {
      hero: { title: '', subtitle: '', introText: '' },
      story: { heading: '', paragraph: '' },
      journey: [],
      team: [],
      vision: { points: [] }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await aboutApi.get();
        if (data) {
          // Deep clone to avoid mutating the original response
          const formattedData = JSON.parse(JSON.stringify(data));

          // React Hook Form's useFieldArray requires objects, map string array -> object array
          if (formattedData.vision && Array.isArray(formattedData.vision.points)) {
            formattedData.vision.points = formattedData.vision.points.map(p =>
              typeof p === 'string' ? { value: p } : (p?.value ? p : { value: '' })
            );
          }

          // Ensure arrays are at least empty for useFieldArray
          if (!formattedData.journey) formattedData.journey = [];
          if (!formattedData.team) formattedData.team = [];

          methods.reset(formattedData);
        }
      } catch (error) {
        toast.error('Failed to load About page data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [methods]);

  const validateStep = async () => {
    if (currentStep === 0) return await methods.trigger(['hero.title']);
    if (currentStep === 1) return await methods.trigger(['story.heading']);
    if (currentStep === 3) {
      const teamFields = methods.getValues('team');
      if (!teamFields || teamFields.length === 0) {
        methods.setError('team.root', { message: 'You must add at least 1 team member.' });
        return false;
      }
      return await methods.trigger('team');
    }
    if (currentStep === 4) {
      const visionFields = methods.getValues('vision.points');

      const nonEmptyPoints = (visionFields || []).filter(v => {
        if (!v) return false;
        const val = typeof v === 'string' ? v : v.value;
        return val && val.trim() !== '';
      });

      if (nonEmptyPoints.length === 0) {
        methods.setError('vision.points.root', { message: 'You must add at least 1 vision bullet point.' });
        return false;
      }
      methods.clearErrors('vision.points.root');
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) setCurrentStep(prev => prev + 1);
  };
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data) => {
    // Final validation skip check
    const isStep5Valid = await validateStep();
    if (!isStep5Valid) return;

    try {
      // Map vision.points back safely to pure strings for Mongoose
      // Also sanitize payload to remove backend-only fields that might cause upsert issues
      const payload = JSON.parse(JSON.stringify(data));

      if (payload.vision && Array.isArray(payload.vision.points)) {
        payload.vision.points = payload.vision.points
          .map(p => (typeof p === 'object' && p !== null ? p.value : p))
          .filter(p => p && typeof p === 'string' && p.trim() !== '');
      }

      // Cleanup internal fields before sending up
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
      if (payload.journey) payload.journey.forEach(j => delete j._id);
      if (payload.team) payload.team.forEach(t => delete t._id);

      await aboutApi.update(payload);
      toast.success('About page updated successfully!');
    } catch (error) {
      toast.error('Failed to update About page');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto mb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">About Page Master CMS</h1>
        <p className="text-gray-500 mt-2">Edit the dynamically rendered sections of your public About Us page.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Steps Indicator */}
        <div className="lg:w-64 shrink-0 hidden lg:block">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">CMS Builder Steps</h3>
            <div className="space-y-2 relative">
              <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>
              {STEPS.map((step, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={async () => { if (idx < currentStep || await validateStep()) setCurrentStep(idx); }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-colors relative z-10 ${currentStep === idx ? 'bg-purple-50 text-purple-700 font-bold border border-purple-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-bold border-2 ${currentStep === idx ? 'bg-purple-600 border-purple-600 text-white' : currentStep > idx ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-200 text-gray-400'}`}>
                    {idx + 1}
                  </span>
                  {step}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Steps Indicator */}
        <div className="lg:hidden bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="text-sm font-bold text-purple-700">Step {currentStep + 1} of {STEPS.length}</div>
          <div className="text-sm font-medium text-gray-700">{STEPS[currentStep]}</div>
        </div>

        {/* Form Container */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="p-6 sm:p-10 min-h-[500px]">
                  {currentStep === 0 && <Step1Hero />}
                  {currentStep === 1 && <Step2Story />}
                  {currentStep === 2 && <Step3Journey />}
                  {currentStep === 3 && <Step4Team />}
                  {currentStep === 4 && <Step5Vision />}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <button type="button" onClick={prevStep} disabled={currentStep === 0} className="px-6 py-3 text-gray-700 font-bold bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50">
                    Back
                  </button>
                  {currentStep < STEPS.length - 1 ? (
                    <button type="button" onClick={nextStep} className="flex items-center px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                      Continue <ChevronRight size={20} className="ml-2" />
                    </button>
                  ) : (
                    <button type="submit" disabled={methods.formState.isSubmitting} className="flex items-center px-10 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-xl shadow-purple-600/30 transition-all disabled:opacity-50 hover:scale-105">
                      {methods.formState.isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                      Publish Master Record
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAdmin;
