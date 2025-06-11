const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const pug = require('pug');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const Framework = require('../models/Framework');
const Control = require('../models/Control');
const User = require('../models/User');

exports.generateComplianceReport = async (framework, evidences, user) => {
  // 1. Calcul complet des statistiques
  let implemented = 0;
  let compliant = 0;
  let partial = 0;
  let notImplemented = 0;
  let notApplicable = 0;

  const controls = framework.controls || await Control.find({ frameworkId: framework._id });

  controls.forEach(control => {
    const evidence = evidences.find(e => e.controlId.equals(control._id));
    if (evidence) {
      switch (evidence.status) {
        case 'implemented':
          implemented++;
          compliant++;
          break;
        case 'compliant':
          compliant++;
          break;
        case 'partial':
          partial++;
          break;
        case 'not_applicable':
          notApplicable++;
          break;
        default:
          notImplemented++;
      }
    } else {
      notImplemented++;
    }
  });

  const totalControls = controls.length;
  const complianceScore = Math.round((compliant / (totalControls - notApplicable)) * 100) || 0;
  const implementationRate = Math.round((implemented / (totalControls - notApplicable)) * 100) || 0;

  // 2. Construction des données du rapport
  const reportData = {
    frameworkName: framework.name,
    frameworkVersion: framework.version || '1.0',
    userName: `${user.firstName} ${user.lastName}`,
    userPosition: user.position || 'Responsable Conformité',
    company: user.company || 'Notre Organisation',
    reportDate: moment().format('LL'),
    generatedAt: moment().format('LLLL'),
    
    // Métriques complètes
    totalControls,
    implemented,
    compliant,
    partial,
    notImplemented,
    notApplicable,
    complianceScore,
    implementationRate,

    // Détails des contrôles
    controls: controls.map(control => {
      const evidence = evidences.find(e => e.controlId.equals(control._id));
      return {
        id: control.controlId,
        reference: control.reference || 'N/A',
        title: control.title,
        description: control.description || '',
        category: control.category,
        subCategory: control.subCategory || 'Non classé', // SubCategory inclus
        status: evidence ? evidence.status : 'not_implemented',
        maturityLevel: evidence ? evidence.maturityLevel : 0, // MaturityLevel inclus
        evidence: evidence ? evidence.description : 'Aucune preuve fournie',
        comment: evidence ? evidence.comment : '',
        lastUpdated: evidence ? moment(evidence.updatedAt).format('LL') : 'Jamais'
      };
    }),

    // Recommandations générées
    recommendations: this.generateRecommendations(complianceScore, framework)
  };

  // 3. Génération du contenu HTML
  const htmlContent = pug.renderFile(
    path.join(__dirname, '../views/report/report.pug'),
    { data: reportData }
  );

  // 4. Configuration des dossiers
  const reportsDir = path.join(__dirname, '../uploads/reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // 5. Génération des fichiers
  const baseFilename = `compliance_${framework.name.replace(/\s+/g, '_')}_${moment().format('YYYYMMDD-HHmmss')}_${uuidv4().substr(0, 6)}`;
  
  // Fichier HTML
  const htmlFilePath = path.join('uploads/reports', `${baseFilename}.html`);
  fs.writeFileSync(path.join(__dirname, '../', htmlFilePath), htmlContent);

  // Fichier PDF
  const pdfFilePath = path.join('uploads/reports', `${baseFilename}.pdf`);
  const fullPdfPath = path.join(__dirname, '../', pdfFilePath);

  const pdfOptions = {
    format: 'A4',
    orientation: 'portrait',
    border: {
      top: '15mm',
      right: '10mm',
      bottom: '15mm',
      left: '10mm'
    },
    header: {
      height: '10mm',
      contents: `<div style="text-align:center;border-bottom:1px solid #eee;padding-bottom:5px;">
        Rapport de Conformité ${framework.name}
      </div>`
    },
    footer: {
      height: '10mm',
      contents: `<div style="text-align:center;color:#666;font-size:10px;">
        Page {{page}}/{{pages}} | Généré le ${moment().format('LL')}
      </div>`
    },
    timeout: 30000
  };

  await new Promise((resolve, reject) => {
    pdf.create(htmlContent, pdfOptions).toFile(fullPdfPath, (err) => {
      if (err) {
        console.error('Erreur génération PDF:', err);
        return reject(new Error('Échec de la génération PDF'));
      }
      resolve();
    });
  });

  // 6. Retour des résultats
  return {
    reportData,      // Toutes les données analytiques
    files: {         // Chemins d'accès aux fichiers
      html: htmlFilePath,
      pdf: pdfFilePath
    },
    metadata: {      // Métadonnées techniques
      generatedAt: new Date(),
      processTime: `${moment().diff(startTime, 'seconds')}s`,
      formatVersion: '1.2'
    }
  };
};

exports.generateRecommendations = (score, framework) => {
  const recommendations = [];
  
  // Basé sur le score
  if (score < 50) {
    recommendations.push('🚨 Action immédiate requise - Niveau de conformité critique');
    recommendations.push('🔍 Audit complet recommandé');
  } else if (score < 70) {
    recommendations.push('⚠️ Prioriser les contrôles non conformes');
    recommendations.push('👨‍💻 Former les équipes sur les exigences');
  }

  // Spécifiques au framework
  if (/ISO\s*27001/i.test(framework.name)) {
    recommendations.push('🏅 Envisager la certification ISO 27001');
    recommendations.push('📅 Mettre en place des revues de sécurité trimestrielles');
  }
  
  if (/GDPR|RGPD/i.test(framework.name)) {
    recommendations.push('🔐 Auditer les processus de données personnelles');
    recommendations.push('👥 Former le personnel sur la protection des données');
  }

  if (/NIST/i.test(framework.name)) {
    recommendations.push('📊 Adapter les contrôles aux niveaux de risque');
    recommendations.push('🛡️ Implémenter un système de gestion des risques');
  }

  return recommendations;
};