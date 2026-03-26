import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Loader2, ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

// Step Components (we will build these explicitly for Stories)
import Step1StoryBasic from '../../components/admin/StorySteps/Step1StoryBasic';
import Step2StoryLocation from '../../components/admin/StorySteps/Step2StoryLocation';
import Step3StoryBeforeAfter from '../../components/admin/StorySteps/Step3StoryBeforeAfter';
import Step4StoryProcess from '../../components/admin/StorySteps/Step4StoryProcess';
import Step6ContentBuilder from '../../components/admin/ContentBuilder/Step6ContentBuilder'; // Reused
import Step6StoryTestimonial from '../../components/admin/StorySteps/Step6StoryTestimonial';
import Step7StoryGallery from '../../components/admin/StorySteps/Step7StoryGallery';
import Step8StorySettings from '../../components/admin/StorySteps/Step8StorySettings';
import { storyApi } from '../../api/storyApi';

const STEPS = [
  'Basic Info', 'Location', 'Before / After', 'Timeline Steps',
  'Content Builder', 'Testimonial', 'Image Gallery', 'Publish Settings'
];

const StoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id) && id !== 'new';

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {
      title: '', slug: '', thumbnail: '', shortDescription: '',
      location: { placeName: '', city: '', state: '', country: '' },
      beforeImages: [], afterImages: [],
      processSteps: [],
      contentBlocks: [],
      testimonial: { clientName: '', designation: '', message: '', rating: 5 },
      galleryImages: [],
      isFeatured: false, isPublished: false
    }
  });

  const { handleSubmit, reset, trigger } = methods;

  useEffect(() => {
    if (isEditing) {
      fetchStory();
    }
  }, [id, isEditing]);

  const fetchStory = async () => {
    try {
      const data = await storyApi.getByIdOrSlug(id);
      reset(data);
    } catch (error) {
      toast.error('Failed to fetch story details');
      navigate('/admin/stories');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) fieldsToValidate = ['title', 'slug', 'shortDescription'];
    if (currentStep === 1) fieldsToValidate = ['location.city'];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      return isValid;
    }
    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) {
      setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    if (submitting) return;

    if (!data.title || !data.slug || !data.shortDescription) {
      toast.error('Please fill all required Basic info');
      setCurrentStep(0);
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await storyApi.update(id, data);
        toast.success('Case Study updated successfully');
      } else {
        await storyApi.create(data);
        toast.success('Case Study published successfully');
      }
      navigate('/admin/stories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save case study');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center h-full items-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto mb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/stories')} className="p-2 mr-4 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{isEditing ? 'Edit Case Study' : 'Build Case Study'}</h1>
            <p className="text-gray-500 text-sm mt-1 sm:block hidden">Complete the steps below to document a project installation.</p>
          </div>
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="lg:hidden mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="text-sm font-bold text-purple-700">Step {currentStep + 1} of {STEPS.length}</div>
        <div className="text-sm font-medium text-gray-700">{STEPS[currentStep]}</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav (Desktop only) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-6">
            <ul className="space-y-1">
              {STEPS.map((stepName, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={async () => {
                      if (idx < currentStep || await validateStep()) setCurrentStep(idx);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${currentStep === idx
                        ? 'bg-purple-50 text-purple-700 font-bold'
                        : currentStep > idx
                          ? 'text-gray-700 hover:bg-gray-50 font-medium'
                          : 'text-gray-400 font-medium'
                      }`}
                  >
                    <span className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${currentStep === idx ? 'bg-purple-600 text-white' : currentStep > idx ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {currentStep > idx ? <Check size={14} /> : idx + 1}
                      </span>
                      {stepName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>

                <div className="p-6 sm:p-8 min-h-[400px]">
                  {currentStep === 0 && <Step1StoryBasic />}
                  {currentStep === 1 && <Step2StoryLocation />}
                  {currentStep === 2 && <Step3StoryBeforeAfter />}
                  {currentStep === 3 && <Step4StoryProcess />}
                  {currentStep === 4 && <Step6ContentBuilder />}
                  {currentStep === 5 && <Step6StoryTestimonial />}
                  {currentStep === 6 && <Step7StoryGallery />}
                  {currentStep === 7 && <Step8StorySettings />}
                </div>

                {/* Footer Controls */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-2xl">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {currentStep < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors"
                    >
                      Next Step <ChevronRight size={18} className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center px-8 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
                    >
                      {submitting && <Loader2 size={18} className="animate-spin mr-2" />}
                      Publish Case Study
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

export default StoryForm;
