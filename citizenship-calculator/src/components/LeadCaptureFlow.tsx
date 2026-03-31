import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore } from '@/store/useAppStore';
import { DatePicker } from '@/components/ui/DatePicker';
import { differenceInYears } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const formSchema = z.object({
  dob: z.date({
    message: 'Date of Birth is required'
  }).refine((date) => differenceInYears(new Date(), date) >= 18, {
    message: 'You must be at least 18 years old.',
  }),
  whatsapp: z.string()
    .min(10, 'Must be 10 digits')
    .max(10, 'Must be 10 digits')
    .regex(/^\d+$/, 'Must contain only numbers')
});

type LeadFormData = z.infer<typeof formSchema>;

export function LeadCaptureFlow() {
  const { state, setSearching, setReveal } = useAppStore();
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LeadFormData) => {
    // 1. Simulate Tracking
    console.log('[Meta Pixel] Track Event: Lead', data);
    console.log('[GA4] Track Event: form_submit', { timeOnPage: performance.now() });

    // 2. Transition to Searching
    setSearching();

    // 3. Wait 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 4. Transition to Reveal
    setReveal();
  };

  const status = state.status;

  return (
    <div className="w-full [perspective:1000px] absolute inset-0 flex items-center justify-center pointer-events-none p-4 sm:p-8">
      <AnimatePresence mode="wait">
        
        {/* State 1: Lead Capture Form */}
        {status === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="w-full max-w-lg pointer-events-auto"
          >
            <Card className="w-full p-6 sm:p-8 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-[0_30px_60px_rgba(0,43,94,0.5)] relative overflow-hidden rounded-3xl text-white">
              
              <div className="mb-8 text-center relative z-10 space-y-2">
                 <motion.h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                   When will you get your Citizenship?
                 </motion.h2>
                 <p className="text-white/80 text-sm font-medium">Verify your timeline down below.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <DatePicker
                        label="Date of Birth"
                        required
                        value={field.value as Date | null}
                        onChange={(date: Date | null) => {
                          if (date) field.onChange(date);
                        }}
                        error={errors.dob?.message}
                      />
                    </div>
                  )}
                />

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-sm font-medium text-white flex gap-1">
                    WhatsApp Number <span className="text-accent-orange">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center gap-1.5 z-10 select-none">
                      <span className="text-lg leading-none mt-0.5">🇺🇸</span>
                      <span className="text-slate-500 font-medium">+1</span>
                      <div className="h-5 w-[1px] bg-slate-200 ml-1"></div>
                    </div>
                    <input
                      {...register('whatsapp')}
                      type="tel"
                      placeholder="000-000-0000"
                      className={`flex h-12 w-full rounded-xl border ${errors.whatsapp ? 'border-accent-red ring-1 ring-accent-red' : 'border-slate-300'} bg-white text-primary-navy pl-[5.5rem] pr-4 py-2 text-lg placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-orange transition-all`}
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-sm text-accent-red font-medium">
                      {errors.whatsapp.message}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group h-14 sm:h-16 bg-gradient-to-r from-accent-orange to-[#E08A20] hover:from-[#E08A20] hover:to-[#CF7F1C] text-primary-navy font-extrabold text-xl shadow-[0_8px_20px_rgba(255,153,51,0.3)] border-b-[4px] border-[#B8701B] rounded-full hover:-translate-y-0.5 active:translate-y-1 active:border-b-[2px] transition-all"
                    disabled={isSubmitting}
                  >
                    <motion.div 
                      animate={{ x: ["-100%", "200%"], opacity: [0, 1, 0] }} 
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 2 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />
                    <span className="group-hover:scale-105 transition-transform duration-300">
                      {isSubmitting ? 'Authenticating...' : 'Check Status'}
                    </span>
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* State 2: Searching... (Cultural Animation) */}
        {status === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center space-y-8 select-none"
          >
            {/* Mandala/Lotus Abstract Pulse */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-accent-gold/40 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-4 border-2 border-accent-orange/60 rounded-full" 
              />
              {/* Inner glowing core */}
              <motion.div
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="w-16 h-16 bg-accent-gold rounded-full blur-[20px]"
              />
              <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 className="w-12 h-12 bg-white rounded-full z-10 shadow-[0_0_30px_#D4AF37]"
              />
            </div>
            
            <motion.h3 
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="text-2xl font-bold text-accent-gold tracking-[0.2em] uppercase"
            >
              Authenticating...
            </motion.h3>
          </motion.div>
        )}

        {/* State 3: The Reveal */}
        {status === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="w-full max-w-lg pointer-events-auto text-center space-y-8 px-4"
          >
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3, duration: 0.8 }}
               className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Citizenship <span className="text-accent-gold block italic font-serif my-2">takes time</span>
              </h2>
              <p className="text-xl text-white/90 font-medium">
                ...but you don't have to wait for India.
              </p>
              
              <div className="pt-6">
                <a href="https://ganges.com" className="block w-full">
                  <Button className="w-full relative overflow-hidden group h-16 sm:h-20 bg-gradient-to-r from-accent-gold to-[#B8942A] hover:from-[#B8942A] hover:to-[#9E7D20] text-[#002B5E] font-black text-xl sm:text-2xl shadow-[0_10px_30px_rgba(212,175,55,0.4)] border-b-[6px] border-[#9E7D20] rounded-[2rem] hover:-translate-y-1 active:translate-y-1 active:border-b-[2px] transition-all">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Shop like you're in India
                      <motion.span 
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-2xl"
                      >→</motion.span>
                    </span>
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
