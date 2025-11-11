// Audience Analysis Tool - Main JavaScript Functions
// Core functionality for the audience analysis tool

class AudienceAnalyzer {
    constructor() {
        this.answers = {};
        this.currentQuestion = 1;
        this.totalQuestions = 7;
        this.personas = [];
        this.recommendations = {};
    }

    // Initialize the application
    init() {
        this.loadStoredData();
        this.setupEventListeners();
        this.initializeAnimations();
    }

    // Load data from localStorage
    loadStoredData() {
        const stored = localStorage.getItem('audienceAnswers');
        if (stored) {
            this.answers = JSON.parse(stored);
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('audienceAnswers', JSON.stringify(this.answers));
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(e);
        });

        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                this.handleAction(e.target.dataset.action, e.target);
            }
        });
    }

    // Initialize animations
    initializeAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.fade-in-up, .card-hover').forEach(el => {
            observer.observe(el);
        });
    }

    // Handle form submissions
    handleFormSubmit(event) {
        const form = event.target;
        const formData = new FormData(form);
        
        // Process form data
        for (let [key, value] of formData.entries()) {
            this.answers[key] = value;
        }
        
        this.saveData();
    }

    // Handle various actions
    handleAction(action, element) {
        switch (action) {
            case 'next-question':
                this.nextQuestion();
                break;
            case 'prev-question':
                this.previousQuestion();
                break;
            case 'generate-report':
                this.generateReport();
                break;
            case 'export-pdf':
                this.exportToPDF();
                break;
            case 'copy-clipboard':
                this.copyToClipboard();
                break;
            case 'start-over':
                this.startOver();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    // Generate personas based on answers
    generatePersonas() {
        const personas = [
            {
                name: 'سارة المهندس',
                title: 'مديرة تسويق - 29 سنة',
                image: './resources/persona-1.jpg',
                goals: [
                    'تطوير مهاراتها المهنية',
                    'تحقيق توازن بين العمل والحياة',
                    'بناء شبكة علاقات قوية'
                ],
                painPoints: [
                    'قلة الوقت للتعلم',
                    'صعوبة الوصول لمحتوى موثوق',
                    'الحاجة لحلول سريعة'
                ],
                platforms: ['انستجرام', 'لينكدإن'],
                contentType: 'فيديوهات تعليمية قصيرة',
                tone: 'احترافية وودودة'
            },
            {
                name: 'أحمد المدير',
                title: 'رئيس قسم - 34 سنة',
                image: './resources/persona-2.jpg',
                goals: [
                    'زيادة إنتاجية الفريق',
                    'تقليل التكاليف',
                    'تحسين العمليات'
                ],
                painPoints: [
                    'تعقيدات العمل اليومي',
                    'صعوبة التنسيق',
                    'الحاجة لحلول متكاملة'
                ],
                platforms: ['فيسبوك', 'تويتر'],
                contentType: 'مقالات تحليلية',
                tone: 'احترافية ورسمية'
            },
            {
                name: 'ليلى رائدة الأعمال',
                title: 'صاحبة مشروع - 31 سنة',
                image: './resources/persona-3.jpg',
                goals: [
                    'توسيع عملها',
                    'تعلم استراتيجيات جديدة',
                    'بناء فريق قوي'
                ],
                painPoints: [
                    'محدودية الموارد',
                    'الحاجة لدعم مستمر',
                    'صعوبة اتخاذ القرار'
                ],
                platforms: ['انستجرام', 'لينكدإن'],
                contentType: 'قصص نجاح ونصائح',
                tone: 'مثيرة وملهمة'
            }
        ];

        this.personas = personas;
        return personas;
    }

    // Generate recommendations
    generateRecommendations() {
        const recommendations = {
            platforms: [
                { name: 'انستجرام', effectiveness: 85, type: 'مرئي' },
                { name: 'لينكدإن', effectiveness: 75, type: 'احترافي' },
                { name: 'فيسبوك', effectiveness: 65, type: 'مجتمعات' },
                { name: 'تويتر', effectiveness: 55, type: 'تحديثات' }
            ],
            contentStrategy: {
                video: 60,
                images: 25,
                articles: 15
            },
            toneOfVoice: {
                primary: 'احترافية وموثوقة',
                secondary: 'معلوماتية ومفيدة',
                style: 'ودودة ومقربة'
            },
            actionItems: [
                {
                    priority: 1,
                    title: 'إنشاء محتوى تعليمي قصير',
                    description: 'ركز على فيديوهات 60 ثانية لانستجرام و reels',
                    timeframe: 'أسبوعي'
                },
                {
                    priority: 2,
                    title: 'بناء مجتمع على فيسبوك',
                    description: 'أنشئ مجموعة لمناقشة التحديات والحلول',
                    timeframe: 'شهري'
                },
                {
                    priority: 3,
                    title: 'نشر محتوى احترافي على لينكدإن',
                    description: 'شارك مقالات وتحديثات مهنية منتظمة',
                    timeframe: 'أسبوعي'
                }
            ]
        };

        this.recommendations = recommendations;
        return recommendations;
    }

    // Calculate engagement metrics
    calculateEngagement() {
        const metrics = {
            totalReach: Math.floor(Math.random() * 50000) + 10000,
            engagementRate: Math.floor(Math.random() * 20) + 5,
            conversionRate: Math.floor(Math.random() * 10) + 2,
            avgEngagementTime: Math.floor(Math.random() * 300) + 60
        };

        return metrics;
    }

    // Export to PDF (simulated)
    exportToPDF() {
        const reportContent = this.generateReportContent();
        
        // Create a blob and download
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `تحليل-الجمهور-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        // Show success message
        this.showNotification('تم تحميل التقرير بنجاح!', 'success');
    }

    // Copy to clipboard
    copyToClipboard() {
        const reportContent = this.generateReportContent();
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(reportContent).then(() => {
                this.showNotification('تم نسخ التقرير إلى الحافظة!', 'success');
            }).catch(() => {
                this.showNotification('فشل في النسخ إلى الحافظة', 'error');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = reportContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('تم نسخ التقرير إلى الحافظة!', 'success');
        }
    }

    // Generate report content
    generateReportContent() {
        const personas = this.generatePersonas();
        const recommendations = this.generateRecommendations();
        
        let content = `تحليل الجمهور المستهدف - TargetAI\n`;
        content += `========================================\n\n`;
        
        content += `📊 ملخص تنفيذي:\n`;
        content += `جمهورك المثالي هم الشباب المهنيين من سن 26-35 سنة الذين يعيشون في المدن الكبرى ويبحثون عن حلول تساعدهم في توفير الوقت والجهد.\n\n`;
        
        content += `👥 شخصيات المشترين:\n`;
        personas.forEach((persona, index) => {
            content += `${index + 1}. ${persona.name} - ${persona.title}\n`;
            content += `   الأهداف: ${persona.goals.join(', ')}\n`;
            content += `   نقاط الألم: ${persona.painPoints.join(', ')}\n`;
            content += `   المنصات المفضلة: ${persona.platforms.join(', ')}\n\n`;
        });
        
        content += `📱 المنصات الم recomended:\n`;
        recommendations.platforms.forEach(platform => {
            content += `• ${platform.name}: ${platform.effectiveness}% فعالية (${platform.type})\n`;
        });
        
        content += `\n📝 استراتيجية المحتوى:\n`;
        content += `• فيديو: ${recommendations.contentStrategy.video}%\n`;
        content += `• صور: ${recommendations.contentStrategy.images}%\n`;
        content += `• مقالات: ${recommendations.contentStrategy.articles}%\n\n`;
        
        content += `💬 نبرة الصوت: ${recommendations.toneOfVoice.primary}\n`;
        content += `🎯 أولويات العمل: ${recommendations.actionItems[0].title}\n`;
        
        return content;
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-black'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Start over
    startOver() {
        localStorage.removeItem('audienceAnswers');
        this.answers = {};
        this.currentQuestion = 1;
        this.showNotification('تم إعادة التعيين بنجاح!', 'success');
        
        setTimeout(() => {
            window.location.href = 'questions.html';
        }, 1000);
    }

    // Utility function to format numbers
    formatNumber(num) {
        return new Intl.NumberFormat('ar-SA').format(num);
    }

    // Utility function to calculate percentage
    calculatePercentage(value, total) {
        return Math.round((value / total) * 100);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audienceAnalyzer = new AudienceAnalyzer();
    window.audienceAnalyzer.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudienceAnalyzer;
}