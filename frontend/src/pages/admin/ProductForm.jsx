import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Loader2, ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { productApi } from '../../api';

// Step Components (will be imported once built)
import Step1Basic from '../../components/admin/ProductSteps/Step1Basic';
import Step2Media from '../../components/admin/ProductSteps/Step2Media';
import Step3Description from '../../components/admin/ProductSteps/Step3Description';
import Step4Pricing from '../../components/admin/ProductSteps/Step4Pricing';
import Step5Specs from '../../components/admin/ProductSteps/Step5Specs';
import Step6ContentBuilder from '../../components/admin/ContentBuilder/Step6ContentBuilder';
import Step7Extra from '../../components/admin/ProductSteps/Step7Extra';
import Step8SEO from '../../components/admin/ProductSteps/Step8SEO';
import Step9Flags from '../../components/admin/ProductSteps/Step9Flags';

const STEPS = [
  'Basic Info', 'Media', 'Descriptions', 'Pricing & Sizes', 
  'Specifications', 'Content Builder', 'Extra Info', 'SEO', 'Status & Flags'
];

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Safe check in case react router sends 'new' as the :id parameter
  const isEditing = Boolean(id) && id !== 'new';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: '', slug: '', sku: '', productType: 'Fixed Price', category: '',
      thumbnail: '', images: [],
      shortDescription: '', description: '',
      sizes: [], specifications: [],
      contentBlocks: [],
      installationGuide: '', careInstructions: '', isCustomizable: false,
      seoTitle: '', seoDescription: '',
      featured: false, recent: false, bestSeller: false, isVisible: true, status: 'Draft'
    }
  });

  const { handleSubmit, reset, trigger } = methods;

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchProduct = async () => {
    try {
      const data = await productApi.getById(id);
      if (data.category && typeof data.category === 'object') {
        data.category = data.category._id;
      }
      reset(data);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'category', 'productType'];
    if (currentStep === 1) fieldsToValidate = ['thumbnail'];
    
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
    
    if (!data.name || !data.category || !data.thumbnail) {
      toast.error('Please fill all required fields (Name, Category, Thumbnail)');
      return;
    }
    if (data.productType === 'Fixed Price' && (!data.sizes || data.sizes.length === 0)) {
      toast.error('Fixed Price products require at least one size/price variant');
      setCurrentStep(3);
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await productApi.update(id, data);
        toast.success('Product updated successfully');
      } else {
        await productApi.create(data);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
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
          <button onClick={() => navigate('/admin/products')} className="p-2 mr-4 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-gray-500 text-sm mt-1 sm:block hidden">Complete the steps below to build your product page.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => { methods.setValue('status', 'Draft'); handleSubmit(onSubmit)(); }} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full sm:w-auto text-sm">
            Save as Draft
          </button>
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
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                      currentStep === idx 
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
                  {currentStep === 0 && <Step1Basic />}
                  {currentStep === 1 && <Step2Media />}
                  {currentStep === 2 && <Step3Description />}
                  {currentStep === 3 && <Step4Pricing />}
                  {currentStep === 4 && <Step5Specs />}
                  {currentStep === 5 && <Step6ContentBuilder />}
                  {currentStep === 6 && <Step7Extra />}
                  {currentStep === 7 && <Step8SEO />}
                  {currentStep === 8 && <Step9Flags />}
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
                      Publish Product
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

export default ProductForm;
