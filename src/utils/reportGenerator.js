/**
 * Infuse Branded Report Generator
 * Generates PDF and Word reports with Infuse branding
 */

// Company Information
export const INFUSE_INFO = {
  name: 'Infuse AI Healthcare Technologies',
  website: 'www.infuse.net.in',
  email: 'info@infuse.net.in',
  phone: '+91-9876-543210',
  address: 'Bangalore, Karnataka, India',
  tagline: 'AI-Powered Healthcare Solutions',
  logo: '/infuse_logo_original.jpg'
};

/**
 * Generate PDF from wellness plan data
 */
export const generateWellnessPDF = async (plan, patientName = 'User') => {
  // Create a printable HTML content
  const content = generateReportHTML(plan, patientName);
  
  // Open print dialog
  const printWindow = window.open('', '_blank');
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for images to load then print
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

/**
 * Generate Word document from wellness plan
 */
export const generateWellnessWord = async (plan, patientName = 'User') => {
  const content = generateWordContent(plan, patientName);
  
  // Create blob and download
  const blob = new Blob([content], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  
  // For now, we'll create an HTML file that can be opened in Word
  const htmlBlob = new Blob([generateReportHTML(plan, patientName)], { type: 'text/html' });
  const url = URL.createObjectURL(htmlBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `HealthTrack_Wellness_Plan_${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate report HTML with Infuse branding
 */
const generateReportHTML = (plan, patientName) => {
  const today = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HealthTrack Pro - Wellness Plan Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo-section img {
      height: 60px;
      border-radius: 8px;
    }
    .company-info {
      text-align: right;
      font-size: 12px;
      color: #666;
    }
    .company-name {
      font-size: 18px;
      font-weight: bold;
      color: #10b981;
    }
    .report-title {
      text-align: center;
      margin-bottom: 30px;
    }
    .report-title h1 {
      font-size: 28px;
      color: #1e293b;
      margin-bottom: 5px;
    }
    .report-title .subtitle {
      color: #64748b;
      font-size: 14px;
    }
    .patient-info {
      background: #f8fafc;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 25px;
    }
    .patient-info h3 {
      color: #10b981;
      margin-bottom: 10px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }
    .info-item label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }
    .info-item p {
      font-weight: 600;
      color: #1e293b;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      color: #1e293b;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .section-icon {
      width: 30px;
      height: 30px;
      background: #10b981;
      color: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #10b981;
    }
    .stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }
    .meal-item {
      background: #fafafa;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .meal-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .meal-name {
      font-weight: 600;
      color: #1e293b;
    }
    .meal-time {
      color: #64748b;
      font-size: 12px;
    }
    .meal-calories {
      color: #10b981;
      font-weight: 600;
    }
    .food-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .food-tag {
      background: #e2e8f0;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    .asana-item {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .asana-name {
      font-weight: 600;
      color: #7c3aed;
    }
    .asana-sanskrit {
      font-style: italic;
      color: #a78bfa;
      font-size: 12px;
    }
    .benefits-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    .benefit-tag {
      background: #f0fdf4;
      color: #10b981;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
    }
    .recommendation-list {
      list-style: none;
    }
    .recommendation-list li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
      border-bottom: 1px solid #f1f5f9;
    }
    .recommendation-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #10b981;
      text-align: center;
    }
    .powered-by {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 10px;
    }
    .powered-by strong {
      color: #10b981;
    }
    .contact-info {
      font-size: 12px;
      color: #94a3b8;
    }
    .disclaimer {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 15px;
      padding: 10px;
      background: #f8fafc;
      border-radius: 4px;
    }
    @media print {
      body { padding: 0; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Header with Logo -->
  <div class="header">
    <div class="logo-section">
      <img src="${window.location.origin}/infuse_logo_original.jpg" alt="Infuse AI" onerror="this.style.display='none'">
    </div>
    <div class="company-info">
      <div class="company-name">Infuse AI</div>
      <div>Healthcare Technologies</div>
      <div>${INFUSE_INFO.website}</div>
      <div>${INFUSE_INFO.email}</div>
      <div>${INFUSE_INFO.phone}</div>
    </div>
  </div>

  <!-- Report Title -->
  <div class="report-title">
    <h1>🏥 HealthTrack Pro</h1>
    <h2 style="color: #10b981; font-size: 22px;">Personalized Wellness Plan</h2>
    <div class="subtitle">Generated on ${today}</div>
  </div>

  <!-- Patient Info -->
  <div class="patient-info">
    <h3>📋 Plan Overview</h3>
    <div class="info-grid">
      <div class="info-item">
        <label>Patient Name</label>
        <p>${patientName}</p>
      </div>
      <div class="info-item">
        <label>Plan Duration</label>
        <p>${plan.plan_duration?.replace('_', ' ') || '4 weeks'}</p>
      </div>
      <div class="info-item">
        <label>Focus Areas</label>
        <p>${plan.focus_areas?.map(f => f.replace(/_/g, ' ')).join(', ') || 'General Wellness'}</p>
      </div>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-value">${plan.diet_plan?.daily_calorie_target || 2000}</div>
      <div class="stat-label">Daily Calories</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${plan.diet_plan?.hydration_target_liters || 2.5}L</div>
      <div class="stat-label">Hydration</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${plan.workout_plan?.total_weekly_minutes || 180}</div>
      <div class="stat-label">Weekly Exercise (min)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${plan.yoga_plan?.total_duration_minutes || 45}</div>
      <div class="stat-label">Daily Yoga (min)</div>
    </div>
  </div>

  <!-- Diet Plan Section -->
  <div class="section">
    <div class="section-title">
      <div class="section-icon">🥗</div>
      <span>Diet Plan</span>
    </div>
    
    <h4 style="color: #64748b; margin-bottom: 10px;">Macro Distribution</h4>
    <div style="display: flex; gap: 20px; margin-bottom: 15px;">
      <span>🔵 Carbs: ${plan.diet_plan?.macro_distribution?.carbs || 50}%</span>
      <span>🔴 Protein: ${plan.diet_plan?.macro_distribution?.protein || 25}%</span>
      <span>🟡 Fats: ${plan.diet_plan?.macro_distribution?.fats || 25}%</span>
    </div>

    <h4 style="color: #64748b; margin-bottom: 10px;">Daily Meals</h4>
    ${plan.diet_plan?.meals?.map(meal => `
      <div class="meal-item">
        <div class="meal-header">
          <span class="meal-name">${meal.meal_type?.replace(/_/g, ' ')}</span>
          <span class="meal-time">${meal.time}</span>
          <span class="meal-calories">${meal.calories} kcal</span>
        </div>
        <div class="food-list">
          ${meal.foods?.map(food => `<span class="food-tag">${food}</span>`).join('') || ''}
        </div>
      </div>
    `).join('') || ''}

    <h4 style="color: #64748b; margin: 15px 0 10px;">Foods to Include</h4>
    <div class="food-list">
      ${plan.diet_plan?.foods_to_include?.slice(0, 8).map(food => `<span class="food-tag" style="background: #d1fae5;">${food}</span>`).join('') || ''}
    </div>

    <h4 style="color: #64748b; margin: 15px 0 10px;">Foods to Avoid</h4>
    <div class="food-list">
      ${plan.diet_plan?.foods_to_avoid?.slice(0, 8).map(food => `<span class="food-tag" style="background: #fee2e2;">${food}</span>`).join('') || ''}
    </div>
  </div>

  <!-- Yoga Section -->
  <div class="section">
    <div class="section-title">
      <div class="section-icon" style="background: #7c3aed;">🧘</div>
      <span>Yoga & Meditation Plan</span>
    </div>

    <h4 style="color: #64748b; margin-bottom: 10px;">Recommended Asanas</h4>
    ${plan.yoga_plan?.asanas?.map(asana => `
      <div class="asana-item">
        <div class="asana-name">${asana.name}</div>
        <div class="asana-sanskrit">${asana.sanskrit_name}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
          ⏱️ ${asana.duration_minutes} min | 📊 ${asana.difficulty}
        </div>
        <div class="benefits-list">
          ${asana.benefits?.map(b => `<span class="benefit-tag">${b}</span>`).join('') || ''}
        </div>
        ${asana.contraindications?.length > 0 ? `
          <div style="font-size: 11px; color: #ef4444; margin-top: 8px;">
            ⚠️ Avoid if: ${asana.contraindications.join(', ')}
          </div>
        ` : ''}
      </div>
    `).join('') || ''}
  </div>

  <!-- Recommendations -->
  <div class="section">
    <div class="section-title">
      <div class="section-icon" style="background: #f59e0b;">💡</div>
      <span>Daily Recommendations</span>
    </div>
    <ul class="recommendation-list">
      ${plan.recommendations?.map(rec => `<li>${rec}</li>`).join('') || ''}
    </ul>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="powered-by">
      Powered by <strong>Infuse AI HealthTrack Pro</strong>
    </div>
    <div class="contact-info">
      ${INFUSE_INFO.website} | ${INFUSE_INFO.email} | ${INFUSE_INFO.phone}
    </div>
    <div class="disclaimer">
      This wellness plan is generated using AI technology and is for informational purposes only. 
      Please consult with a qualified healthcare professional before making any changes to your diet, 
      exercise routine, or medical treatment. Infuse AI is not responsible for any health outcomes 
      resulting from following this plan.
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate simple content for Word export
 */
const generateWordContent = (plan, patientName) => {
  return generateReportHTML(plan, patientName);
};

export default {
  generateWellnessPDF,
  generateWellnessWord,
  INFUSE_INFO
};
