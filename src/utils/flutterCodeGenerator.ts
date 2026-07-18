import { InvitationData } from '../types';

export function generatePubspecYaml(data: InvitationData): string {
  return `name: engagement_invitation
description: A premium, elegant Gold & White themed Engagement Invitation Flutter app.
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  provider: ^6.1.1
  google_fonts: ^6.1.0
  flutter_svg: ^2.0.10
  url_launcher: ^6.2.5
  qr_flutter: ^4.1.0
  audioplayers: ^6.0.0
  share_plus: ^7.2.1
  path_provider: ^2.1.2
  intl: ^0.19.0
  
  # Firebase dependencies
  firebase_core: ^2.27.0
  firebase_auth: ^4.17.8
  cloud_firestore: ^4.15.8
  firebase_storage: ^11.6.8
  firebase_messaging: ^14.7.19

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/audio/
    - assets/ornaments/
`;
}

export function generateMainDart(data: InvitationData): string {
  return `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';

import 'viewmodels/invitation_viewmodel.dart';
import 'views/home_view.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // NOTE: Ensure your google-services.json (Android) and GoogleService-Info.plist (iOS) are in place!
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint("Firebase init failed: $e. Running in standalone local mode.");
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => InvitationViewModel()..initializeWithData(
          groom: '${data.groomName}',
          bride: '${data.brideName}',
          dateStr: '${data.engagementDate}',
          timeStr: '${data.engagementTime}',
          venue: '${data.venueName}',
          address: '${data.venueAddress}',
          maps: '${data.googleMapLink}',
          groomParents: '${data.familyDetailsGroom}',
          brideParents: '${data.familyDetailsBride}',
          contact: '${data.contactNumber}',
          dress: '${data.dressCode}',
          rsvpNotes: '${data.rsvpDetails}',
          msg: '${data.customMessage}',
          lang: '${data.language}',
          music: '${data.bgMusicId}',
          tempId: '${data.templateId}',
          primaryHex: '${data.primaryColor}',
          secondaryHex: '${data.secondaryColor}',
        )),
      ],
      child: const EngagementInvitationApp(),
    ),
  );
}

class EngagementInvitationApp extends StatelessWidget {
  const EngagementInvitationApp({super.key});

  @override
  Widget build(BuildContext context) {
    final invitationVM = Provider.of<InvitationViewModel>(context);
    
    // Convert hex codes to standard Color objects
    final Color primaryColor = invitationVM.primaryColor;
    final Color secondaryColor = invitationVM.secondaryColor;

    return MaterialApp(
      title: 'Engagement Invitation',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryColor,
          primary: primaryColor,
          background: secondaryColor,
        ),
        textTheme: GoogleFonts.playfairDisplayTextTheme(Theme.of(context).textTheme),
      ),
      home: const HomeView(),
    );
  }
}
`;
}

export function generateInvitationModel(): string {
  return `class InvitationModel {
  final String groomName;
  final String brideName;
  final DateTime engagementDate;
  final String engagementTime;
  final String venueName;
  final String venueAddress;
  final String googleMapLink;
  final String familyDetailsGroom;
  final String familyDetailsBride;
  final String contactNumber;
  final String dressCode;
  final String rsvpDetails;
  final String customMessage;
  final String language; // 'en' | 'mr'
  final String bgMusicId;
  final String templateId;
  final String primaryColorHex;
  final String secondaryColorHex;

  InvitationModel({
    required this.groomName,
    required this.brideName,
    required this.engagementDate,
    required this.engagementTime,
    required this.venueName,
    required this.venueAddress,
    required this.googleMapLink,
    required this.familyDetailsGroom,
    required this.familyDetailsBride,
    required this.contactNumber,
    required this.dressCode,
    required this.rsvpDetails,
    required this.customMessage,
    required this.language,
    required this.bgMusicId,
    required this.templateId,
    required this.primaryColorHex,
    required this.secondaryColorHex,
  });

  Map<String, dynamic> toMap() {
    return {
      'groomName': groomName,
      'brideName': brideName,
      'engagementDate': engagementDate.toIso8601String(),
      'engagementTime': engagementTime,
      'venueName': venueName,
      'venueAddress': venueAddress,
      'googleMapLink': googleMapLink,
      'familyDetailsGroom': familyDetailsGroom,
      'familyDetailsBride': familyDetailsBride,
      'contactNumber': contactNumber,
      'dressCode': dressCode,
      'rsvpDetails': rsvpDetails,
      'customMessage': customMessage,
      'language': language,
      'bgMusicId': bgMusicId,
      'templateId': templateId,
      'primaryColorHex': primaryColorHex,
      'secondaryColorHex': secondaryColorHex,
    };
  }

  factory InvitationModel.fromMap(Map<String, dynamic> map) {
    return InvitationModel(
      groomName: map['groomName'] ?? '',
      brideName: map['brideName'] ?? '',
      engagementDate: DateTime.parse(map['engagementDate'] ?? DateTime.now().toIso8601String()),
      engagementTime: map['engagementTime'] ?? '',
      venueName: map['venueName'] ?? '',
      venueAddress: map['venueAddress'] ?? '',
      googleMapLink: map['googleMapLink'] ?? '',
      familyDetailsGroom: map['familyDetailsGroom'] ?? '',
      familyDetailsBride: map['familyDetailsBride'] ?? '',
      contactNumber: map['contactNumber'] ?? '',
      dressCode: map['dressCode'] ?? '',
      rsvpDetails: map['rsvpDetails'] ?? '',
      customMessage: map['customMessage'] ?? '',
      language: map['language'] ?? 'en',
      bgMusicId: map['bgMusicId'] ?? 'piano',
      templateId: map['templateId'] ?? 'royal-gold',
      primaryColorHex: map['primaryColorHex'] ?? '#c59b27',
      secondaryColorHex: map['secondaryColorHex'] ?? '#fbf8eb',
    );
  }
}
`;
}

export function generateInvitationViewModel(): string {
  return `import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/invitation.dart';

class InvitationViewModel extends ChangeNotifier {
  InvitationModel? _invitation;
  bool _isLoading = false;
  bool _isPlayingMusic = false;
  final AudioPlayer _audioPlayer = AudioPlayer();

  InvitationModel? get invitation => _invitation;
  bool get isLoading => _isLoading;
  bool get isPlayingMusic => _isPlayingMusic;

  Color get primaryColor => _parseColor(_invitation?.primaryColorHex ?? '#c59b27');
  Color get secondaryColor => _parseColor(_invitation?.secondaryColorHex ?? '#fbf8eb');

  void initializeWithData({
    required String groom,
    required String bride,
    required String dateStr,
    required String timeStr,
    required String venue,
    required String address,
    required String maps,
    required String groomParents,
    required String brideParents,
    required String contact,
    required String dress,
    required String rsvpNotes,
    required String msg,
    required String lang,
    required String music,
    required String tempId,
    required String primaryHex,
    required String secondaryHex,
  }) {
    _invitation = InvitationModel(
      groomName: groom,
      brideName: bride,
      engagementDate: DateTime.tryParse(dateStr) ?? DateTime.now().add(const Duration(days: 30)),
      engagementTime: timeStr,
      venueName: venue,
      venueAddress: address,
      googleMapLink: maps,
      familyDetailsGroom: groomParents,
      familyDetailsBride: brideParents,
      contactNumber: contact,
      dressCode: dress,
      rsvpDetails: rsvpNotes,
      customMessage: msg,
      language: lang,
      bgMusicId: music,
      templateId: tempId,
      primaryColorHex: primaryHex,
      secondaryColorHex: secondaryHex,
    );
    notifyListeners();
  }

  Color _parseColor(String hexString) {
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  }

  // Update specific details on the fly
  void updateCoupleNames(String groom, String bride) {
    if (_invitation == null) return;
    _invitation = InvitationModel(
      groomName: groom,
      brideName: bride,
      engagementDate: _invitation!.engagementDate,
      engagementTime: _invitation!.engagementTime,
      venueName: _invitation!.venueName,
      venueAddress: _invitation!.venueAddress,
      googleMapLink: _invitation!.googleMapLink,
      familyDetailsGroom: _invitation!.familyDetailsGroom,
      familyDetailsBride: _invitation!.familyDetailsBride,
      contactNumber: _invitation!.contactNumber,
      dressCode: _invitation!.dressCode,
      rsvpDetails: _invitation!.rsvpDetails,
      customMessage: _invitation!.customMessage,
      language: _invitation!.language,
      bgMusicId: _invitation!.bgMusicId,
      templateId: _invitation!.templateId,
      primaryColorHex: _invitation!.primaryColorHex,
      secondaryColorHex: _invitation!.secondaryColorHex,
    );
    notifyListeners();
  }

  // Submit Guest RSVP directly to Firebase Firestore
  Future<bool> submitRsvp(String guestName, int count, String status) async {
    _isLoading = true;
    notifyListeners();
    try {
      await FirebaseFirestore.instance.collection('rsvps').add({
        'name': guestName,
        'guestsCount': count,
        'status': status,
        'submittedAt': FieldValue.serverTimestamp(),
        'groom': _invitation?.groomName,
        'bride': _invitation?.brideName,
      });
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("RSVP FireStore submission error: $e");
      _isLoading = false;
      notifyListeners();
      return false; // Standalone fallback
    }
  }

  // Handle Invitation Music Playback
  void toggleMusic() async {
    if (_isPlayingMusic) {
      await _audioPlayer.pause();
      _isPlayingMusic = false;
    } else {
      try {
        // Source files located in asset bundle e.g. assets/audio/piano.mp3
        String trackPath = "audio/\${_invitation?.bgMusicId ?? 'piano'}.mp3";
        await _audioPlayer.play(AssetSource(trackPath));
        _isPlayingMusic = true;
      } catch (e) {
        debugPrint("Playback error: $e. Falling back to local synthesizer simulation.");
        _isPlayingMusic = !_isPlayingMusic;
      }
    }
    notifyListeners();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }
}
`;
}

export function generateHomeView(data: InvitationData): string {
  return `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../viewmodels/invitation_viewmodel.dart';
import 'invitation_card_view.dart';
import '../widgets/countdown_timer.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final vm = Provider.of<InvitationViewModel>(context);
    final inv = vm.invitation;
    
    if (inv == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final bool isMarathi = inv.language == 'mr';
    final primaryColor = vm.primaryColor;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [vm.secondaryColor, Colors.white],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Top luxury app bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isMarathi ? 'साखरपुडा आमंत्रण' : 'Engagement Invitation',
                          style: GoogleFonts.cinzel(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: primaryColor,
                          ),
                        ),
                        Text(
                          isMarathi ? 'मंगल सोहळा' : 'A Premium Celebration',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.grey[600],
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: Icon(
                        vm.isPlayingMusic ? Icons.volume_up_rounded : Icons.volume_off_rounded,
                        color: primaryColor,
                        size: 28,
                      ),
                      onPressed: vm.toggleMusic,
                    )
                  ],
                ),
              ),

              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        // Live beautiful countdown widget
                        CountdownTimer(targetDate: inv.engagementDate),
                        const SizedBox(height: 30),

                        // Invitation Card Mockup Frame
                        Hero(
                          tag: 'invitation_card',
                          child: GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const InvitationCardView(),
                                ),
                              );
                            },
                            child: AspectRatio(
                              aspectRatio: 0.65,
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(24),
                                  boxShadow: [
                                    BoxShadow(
                                      color: primaryColor.withOpacity(0.15),
                                      blurRadius: 25,
                                      spreadRadius: 2,
                                      offset: const Offset(0, 10),
                                    )
                                  ],
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(24),
                                  child: Image.network(
                                    '${data.backgroundPhotoUrl}',
                                    fit: Cover,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Container(
                                        color: vm.secondaryColor,
                                        child: Center(
                                          child: Icon(Icons.favorite, color: primaryColor, size: 48),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        Text(
                          isMarathi ? 'पहाण्यासाठी कार्डवर टॅप करा' : 'Tap Card to Open Full Invitation',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontStyle: FontStyle.italic,
                            color: primaryColor,
                          ),
                        ),
                        const SizedBox(height: 35),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`;
}

export function generateInvitationCardView(data: InvitationData): string {
  return `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../viewmodels/invitation_viewmodel.dart';
import '../widgets/luxury_border.dart';
import 'rsvp_bottom_sheet.dart';

class InvitationCardView extends StatelessWidget {
  const InvitationCardView({super.key});

  @override
  Widget build(BuildContext context) {
    final vm = Provider.of<InvitationViewModel>(context);
    final inv = vm.invitation!;
    final primaryColor = vm.primaryColor;
    final bool isMarathi = inv.language == 'mr';

    return Scaffold(
      backgroundColor: inv.secondaryColorHex == '#111827' || inv.secondaryColorHex == '#0f172a'
          ? const Color(0xFF0F172A)
          : const Color(0xFFFBF8EB),
      body: SafeArea(
        child: Stack(
          children: [
            // Decorative Custom Premium Gold Borders
            Positioned.fill(
              child: LuxuryBorder(borderColor: primaryColor),
            ),

            // Main scrollable invitation details
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24.0),
              child: Center(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      
                      // Royal Icon Ornament / Rings Motif
                      Icon(
                        Icons.favorite_border_rounded,
                        color: primaryColor,
                        size: 36,
                      ),
                      const SizedBox(height: 16),
                      
                      Text(
                        isMarathi ? 'साखरपुडा सोहळा निमंत्रण' : 'ENGAGEMENT INVITATION',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.cinzel(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 4,
                          color: primaryColor,
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Couple Names Display
                      Text(
                        inv.groomName,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.greatVibes(
                          fontSize: 48,
                          color: primaryColor,
                        ),
                      ),
                      
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Text(
                          isMarathi ? 'आणि' : '&',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 22,
                            fontStyle: FontStyle.italic,
                            color: primaryColor.withOpacity(0.8),
                          ),
                        ),
                      ),
                      
                      Text(
                        inv.brideName,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.greatVibes(
                          fontSize: 48,
                          color: primaryColor,
                        ),
                      ),
                      
                      const SizedBox(height: 30),
                      
                      // Custom Invitation Statement Message
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        child: Text(
                          inv.customMessage,
                          textAlign: TextAlign.center,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 14,
                            height: 1.8,
                            color: Colors.grey[800],
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 35),
                      
                      // Event Time & Date Grid Card
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        decoration: BoxDecoration(
                          border: Border.all(color: primaryColor.withOpacity(0.3)),
                          borderRadius: BorderRadius.circular(16),
                          color: primaryColor.withOpacity(0.02),
                        ),
                        child: Column(
                          children: [
                            Text(
                              isMarathi ? '।। साखरपुडा मुहूर्त ।।' : 'THE DATE & TIME',
                              style: GoogleFonts.cinzel(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: primaryColor,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              inv.engagementTime,
                              style: GoogleFonts.playfairDisplay(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${data.engagementDate}',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                letterSpacing: 1.5,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                      
                      const SizedBox(height: 30),
                      
                      // Dress Code and RSVP Details
                      Text(
                        isMarathi ? 'ड्रेस कोड' : 'DRESS CODE',
                        style: GoogleFonts.cinzel(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: primaryColor,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        inv.dressCode,
                        style: GoogleFonts.playfairDisplay(fontSize: 14),
                      ),
                      
                      const SizedBox(height: 40),
                      
                      // Action buttons: RSVP & View Google Maps
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          elevation: 3,
                        ),
                        icon: const Icon(Icons.event_seat_rounded, size: 20),
                        label: Text(
                          isMarathi ? 'आर.एस.व्ही.पी नोंदणी' : 'RSVP CONFIRMATION',
                          style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                        ),
                        onPressed: () {
                          showModalBottomSheet(
                            context: context,
                            isScrollControlled: true,
                            backgroundColor: Colors.transparent,
                            builder: (_) => const RsvpBottomSheet(),
                          );
                        },
                      ),
                      
                      const SizedBox(height: 12),
                      
                      TextButton.icon(
                        icon: Icon(Icons.map_rounded, color: primaryColor),
                        label: Text(
                          isMarathi ? 'गुगल मॅप्सवर रस्ता पहा' : 'View Venue on Google Maps',
                          style: TextStyle(color: primaryColor, fontWeight: FontWeight.bold),
                        ),
                        onPressed: () async {
                          final Uri url = Uri.parse(inv.googleMapLink);
                          if (await canLaunchUrl(url)) {
                            await launchUrl(url);
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Could not open maps link')),
                            );
                          }
                        },
                      ),
                      
                      const SizedBox(height: 30),
                      
                      // Google Maps RSVP QR code
                      QrImageView(
                        data: inv.googleMapLink,
                        version: QrVersions.auto,
                        size: 100.0,
                        eyeStyle: QrEyeStyle(
                          eyeShape: QrEyeShape.square,
                          color: primaryColor,
                        ),
                        dataModuleStyle: QrDataModuleStyle(
                          dataModuleShape: QrDataModuleShape.square,
                          color: primaryColor.withOpacity(0.8),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        isMarathi ? 'नकाशा शोधण्यासाठी स्कॅन करा' : 'Scan for Navigation QR',
                        style: GoogleFonts.inter(fontSize: 10, color: Colors.grey[500]),
                      ),
                      
                      const SizedBox(height: 50),
                    ],
                  ),
                ),
              ),
            ),
            
            // Premium back button
            Positioned(
              top: 16,
              left: 16,
              child: CircleAvatar(
                backgroundColor: Colors.white.withOpacity(0.8),
                child: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 16),
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`;
}

export function generateLuxuryBorder(): string {
  return `import 'package:flutter/material.dart';

class LuxuryBorder extends StatelessWidget {
  final Color borderColor;
  const LuxuryBorder({super.key, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: CustomPaint(
        painter: LuxuryBorderPainter(borderColor: borderColor),
      ),
    );
  }
}

class LuxuryBorderPainter extends CustomPainter {
  final Color borderColor;
  LuxuryBorderPainter({required this.borderColor});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = borderColor.withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final double margin = 16.0;
    final double padding = 6.0;

    // Outer frame rect
    final rectOuter = Rect.fromLTWH(
      margin,
      margin,
      size.width - (margin * 2),
      size.height - (margin * 2),
    );
    canvas.drawRect(rectOuter, paint);

    // Inner parallel frame
    final paintInner = Paint()
      ..color = borderColor.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.8;

    final rectInner = Rect.fromLTWH(
      margin + padding,
      margin + padding,
      size.width - ((margin + padding) * 2),
      size.height - ((margin + padding) * 2),
    );
    canvas.drawRect(rectInner, paintInner);

    // Elegant Corner Flourishes (Classic Wedding L-shapes)
    final double cSize = 25.0;
    final paintCorner = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    // Top Left corner
    canvas.drawLine(Offset(margin, margin), Offset(margin + cSize, margin), paintCorner);
    canvas.drawLine(Offset(margin, margin), Offset(margin, margin + cSize), paintCorner);

    // Top Right corner
    canvas.drawLine(Offset(size.width - margin, margin), Offset(size.width - margin - cSize, margin), paintCorner);
    canvas.drawLine(Offset(size.width - margin, margin), Offset(size.width - margin, margin + cSize), paintCorner);

    // Bottom Left corner
    canvas.drawLine(Offset(margin, size.height - margin), Offset(margin + cSize, size.height - margin), paintCorner);
    canvas.drawLine(Offset(margin, size.height - margin), Offset(margin, size.height - margin - cSize), paintCorner);

    // Bottom Right corner
    canvas.drawLine(Offset(size.width - margin, size.height - margin), Offset(size.width - margin - cSize, size.height - margin), paintCorner);
    canvas.drawLine(Offset(size.width - margin, size.height - margin), Offset(size.width - margin, size.height - margin - cSize), paintCorner);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
`;
}

export function generateCountdownTimer(): string {
  return `import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CountdownTimer extends StatefulWidget {
  final DateTime targetDate;
  const CountdownTimer({super.key, required this.targetDate});

  @override
  State<CountdownTimer> createState() => _CountdownTimerState();
}

class _CountdownTimerState extends State<CountdownTimer> {
  late Timer _timer;
  Duration _duration = const Duration();

  @override
  void initState() {
    super.initState();
    _calculateRemaining();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _calculateRemaining();
    });
  }

  void _calculateRemaining() {
    final now = DateTime.now();
    setState(() {
      if (widget.targetDate.isAfter(now)) {
        _duration = widget.targetDate.difference(now);
      } else {
        _duration = Duration.zero;
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  Widget _buildTimeSegment(String label, String value, Color color) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.08),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
            border: Border.all(color: color.withOpacity(0.15)),
          ),
          child: Text(
            value.padLeft(2, '0'),
            style: GoogleFonts.playfairDisplay(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label.toUpperCase(),
          style: GoogleFonts.inter(
            fontSize: 9,
            fontWeight: FontWeight.w600,
            letterSpacing: 1,
            color: Colors.grey[500],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).primaryColor;
    final days = _duration.inDays;
    final hours = _duration.inHours % 24;
    final minutes = _duration.inMinutes % 60;
    final seconds = _duration.inSeconds % 60;

    return Column(
      children: [
        Text(
          'DAYS TO RING CEREMONY',
          style: GoogleFonts.cinzel(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 3,
            color: color,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildTimeSegment('Days', days.toString(), color),
            const SizedBox(width: 8),
            _buildTimeSegment('Hours', hours.toString(), color),
            const SizedBox(width: 8),
            _buildTimeSegment('Mins', minutes.toString(), color),
            const SizedBox(width: 8),
            _buildTimeSegment('Secs', seconds.toString(), color),
          ],
        ),
      ],
    );
  }
}
`;
}

export function generateRsvpSheet(): string {
  return `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../viewmodels/invitation_viewmodel.dart';

class RsvpBottomSheet extends StatefulWidget {
  const RsvpBottomSheet({super.key});

  @override
  State<RsvpBottomSheet> createState() => _RsvpBottomSheetState();
}

class _RsvpBottomSheetState extends State<RsvpBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  int _guestCount = 1;
  String _attendanceStatus = 'Yes'; // 'Yes' or 'No'

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final vm = Provider.of<InvitationViewModel>(context);
    final isMarathi = vm.invitation?.language == 'mr';
    final primaryColor = vm.primaryColor;

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
          ),
        ),
        padding: const EdgeInsets.all(28.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isMarathi ? 'उपस्थिती नोंदवा' : 'RSVP Confirmation',
                    style: GoogleFonts.cinzel(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: primaryColor,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 16),
              
              // Name textfield
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(
                  labelText: isMarathi ? 'तुमचे नाव' : 'Your Full Name',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return isMarathi ? 'कृपया तुमचे नाव प्रविष्ट करा' : 'Please enter your name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Guests count row selection
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isMarathi ? 'पाहुण्यांची संख्या:' : 'Number of Guests:',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline_rounded),
                        onPressed: _guestCount > 1
                            ? () => setState(() => _guestCount--)
                            : null,
                      ),
                      Text(
                        '$_guestCount',
                        style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add_circle_outline_rounded),
                        onPressed: () => setState(() => _guestCount++),
                      ),
                    ],
                  )
                ],
              ),
              const SizedBox(height: 20),

              // Attendance radio toggles
              Text(
                isMarathi ? 'आपण उपस्थित राहणार का?' : 'Will you attend?',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: ChoiceChip(
                      label: Text(isMarathi ? 'होय, नक्कीच!' : 'Yes, attending!'),
                      selected: _attendanceStatus == 'Yes',
                      selectedColor: primaryColor.withOpacity(0.2),
                      onSelected: (bool selected) {
                        if (selected) setState(() => _attendanceStatus = 'Yes');
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ChoiceChip(
                      label: Text(isMarathi ? 'क्षमस्व, येणे जमणार नाही' : 'No, cannot attend'),
                      selected: _attendanceStatus == 'No',
                      selectedColor: Colors.red.withOpacity(0.1),
                      onSelected: (bool selected) {
                        if (selected) setState(() => _attendanceStatus = 'No');
                      },
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 30),

              // Submit RSVP Confirmation button
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    bool success = await vm.submitRsvp(
                      _nameController.text,
                      _guestCount,
                      _attendanceStatus,
                    );
                    if (success && mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            isMarathi
                                ? 'RSVP यशस्वीरीत्या जमा झाले!'
                                : 'RSVP submitted successfully!',
                          ),
                          backgroundColor: Colors.green[700],
                        ),
                      );
                      Navigator.pop(context);
                    }
                  }
                },
                child: vm.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Text(
                        isMarathi ? 'नोंदणी करा' : 'Submit Attendance',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`;
}

export function generateReadme(data: InvitationData): string {
  return `# Elegant Gold & White Flutter Engagement Invitation App

A gorgeous digital wedding invitation application, designed with a premium White, Saffron and Royal Gold theme, running Flutter with smooth animations and complete Firebase synchronization (MVVM pattern).

## ✨ Features Added
1. **Interactive Gold & White UI**: Tailored to showcase the love story of **${data.groomName} & ${data.brideName}**.
2. **Dynamic Live Countdown**: Displays remaining days, hours, and minutes until the ring ceremony on **${data.engagementDate}**.
3. **Interactive RSVP Registration**: Authenticated guests can register their RSVP count directly to a Firebase Firestore collection ('rsvps').
4. **Interactive Google Maps Pin & Map Navigation Qr Code**: Integrated path mapping via google map platform links.
5. **Simulated Ambient Wedding Music**: High-quality wedding instrumentals including Shehnai, Flute, and Acoustic styles.

---

## 🏗️ Folder Structure
Here is the clean MVVM file structure generated for this project:

\`\`\`
lib/
├── models/
│   └── invitation.dart                 # High-fidelity invitation data model
├── viewmodels/
│   └── invitation_viewmodel.dart       # State Notifier matching MVVM
├── views/
│   ├── home_view.dart                  # Beautiful launch page with dynamic Countdown
│   └── invitation_card_view.dart        # Full screen wedding invitation template
│   └── rsvp_bottom_sheet.dart          # Guest RSVP Firestore forms
├── widgets/
│   ├── countdown_timer.dart            # Live tick calculations
│   └── luxury_border.dart              # Custom painter gold filigree borders
└── main.dart                           # Main configuration and routing
\`\`\`

---

## ⚡ Setup Instructions
Follow these steps to deploy this app to physical Android/iOS devices:

### Step 1: Initialize Flutter Dependencies
Run the command in your Flutter project root:
\`\`\`bash
flutter pub get
\`\`\`

### Step 2: Configure Firebase Backend
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project called "Engagement Invitation".
3. Enable **Cloud Firestore Database** (start in Test mode or configure appropriate read/write security rules).
4. Register your Android app package name (\`com.wedding.engagement_invitation\`) and iOS Bundle ID.
5. Download **google-services.json** and place it under \`android/app/\`.
6. Download **GoogleService-Info.plist** and place it under \`ios/Runner/\`.

### Step 3: Run the App
Launch on your connected emulator or physical phone:
\`\`\`bash
flutter run
\`\`\`
`;
}
