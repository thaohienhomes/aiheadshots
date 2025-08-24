import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Calendar,
  MapPin,
  Ruler,
  Users,
  Eye,
  Palette
} from 'lucide-react';
import { PageType } from '../../App';
import { 
  ageRanges, 
  genderOptions, 
  ethnicityOptions, 
  heightOptions, 
  bodyTypeOptions,
  hairColorOptions,
  skinToneOptions
} from './constants/personalInfoData';
import { EyeColorSelector } from './components/EyeColorSelector';

interface PersonalInfoProps {
  navigate: (page: PageType) => void;
  uploadData: any;
  updateUploadData: (key: string, data: any) => void;
}

interface FormData {
  name: string;
  age: string;
  ethnicity: string;
  height: string;
  bodyType: string;
  eyeColor: string;
  gender: string;
  hairColor: string;
  skinTone: string;
  preferences: {
    professional: boolean;
    casual: boolean;
    creative: boolean;
    corporate: boolean;
  };
}

export function PersonalInfo({ navigate, uploadData, updateUploadData }: PersonalInfoProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    ethnicity: '',
    height: '',
    bodyType: '',
    eyeColor: '',
    gender: '',
    hairColor: '',
    skinTone: '',
    preferences: {
      professional: false,
      casual: false,
      creative: false,
      corporate: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});



  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: checked
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.ethnicity) {
      newErrors.ethnicity = 'Ethnicity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateUploadData('personalInfo', formData);
      updateUploadData('currentStep', 2);
      navigate('style-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl mb-6">
            <User className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Tell Us About Yourself
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            This information helps our AI create more accurate and personalized headshots that truly represent you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <User className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={`bg-slate-700/50 border-slate-600 ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
                      <SelectTrigger className={`bg-slate-700/50 border-slate-600 ${errors.age ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select your age range" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRanges.map(age => (
                          <SelectItem key={age.value} value={age.value}>{age.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.age && <p className="text-red-400 text-sm">{errors.age}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                      className="flex flex-wrap gap-4"
                    >
                      {genderOptions.map((gender) => (
                        <div key={gender} className="flex items-center space-x-2">
                          <RadioGroupItem value={gender.toLowerCase()} id={gender} />
                          <Label htmlFor={gender} className="cursor-pointer">{gender}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.gender && <p className="text-red-400 text-sm">{errors.gender}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger className={`bg-slate-700/50 border-slate-600 ${errors.ethnicity ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select your ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicityOptions.map(ethnicity => (
                          <SelectItem key={ethnicity.value} value={ethnicity.value}>{ethnicity.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ethnicity && <p className="text-red-400 text-sm">{errors.ethnicity}</p>}
                  </div>
                </div>

                {/* Physical Attributes */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Ruler className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Physical Attributes</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Select value={formData.height} onValueChange={(value) => handleInputChange('height', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Select your height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5ft">Under 5'0"</SelectItem>
                        <SelectItem value="5ft-5ft3">5'0" - 5'3"</SelectItem>
                        <SelectItem value="5ft4-5ft7">5'4" - 5'7"</SelectItem>
                        <SelectItem value="5ft8-5ft11">5'8" - 5'11"</SelectItem>
                        <SelectItem value="6ft-6ft3">6'0" - 6'3"</SelectItem>
                        <SelectItem value="over-6ft3">Over 6'3"</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Select value={formData.bodyType} onValueChange={(value) => handleInputChange('bodyType', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Select your body type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slim">Slim</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="athletic">Athletic</SelectItem>
                        <SelectItem value="curvy">Curvy</SelectItem>
                        <SelectItem value="plus-size">Plus Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <EyeColorSelector
                    selectedEyeColor={formData.eyeColor}
                    onEyeColorChange={(color) => handleInputChange('eyeColor', color)}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="hairColor">Hair Color</Label>
                    <Select value={formData.hairColor} onValueChange={(value) => handleInputChange('hairColor', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Select your hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="blonde">Blonde</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skinTone">Skin Tone</Label>
                    <Select value={formData.skinTone} onValueChange={(value) => handleInputChange('skinTone', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600">
                        <SelectValue placeholder="Select your skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-light">Very Light</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium-light">Medium Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="medium-dark">Medium Dark</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="very-dark">Very Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Style Preferences */}
              <div className="mt-8 pt-8 border-t border-slate-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Palette className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Style Preferences</h2>
                </div>
                
                <p className="text-slate-400 mb-4">
                  Select the styles you're most interested in (optional - helps us prioritize):
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => handlePreferenceChange(key, checked as boolean)}
                      />
                      <Label htmlFor={key} className="capitalize cursor-pointer">
                        {key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8"
        >
          <Button
            onClick={() => navigate('image-upload')}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700/50 px-6 py-3 order-2 sm:order-1"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          
          <div className="text-center order-1 sm:order-2">
            <div className="flex items-center gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 2 
                      ? 'bg-cyan-500 text-white' 
                      : index < 2
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {index < 2 ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {index < 4 && (
                    <div className={`w-8 h-px mx-2 ${
                      index < 2 ? 'bg-green-500' : 'bg-slate-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-400">
              Step 3 of 5: Personal Information
            </div>
          </div>

          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 order-3"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}