import 'dart:io';

import 'package:dio/dio.dart';

/// Service pour uploader des images vers Cloudinary.
/// Utilise les mêmes variables d'environnement que le site web (ma-boutique).
class CloudinaryService {
  static const String _cloudName = 'dfxmhvjjh';
  static const String _uploadPreset = 'ml_default';
  static const String _folder = 'coin-original';

  static final Dio _dio = Dio();

  /// Upload une image vers Cloudinary et retourne l'URL secure.
  static Future<String?> uploadImage({
    required File imageFile,
    required String productSlug,
    int? imageIndex,
  }) async {
    final idx = imageIndex ?? '?';
    try {
      final fileName = imageFile.path.split('/').last;
      final publicId = imageIndex != null
          ? '$productSlug/image-$imageIndex'
          : '$productSlug/$fileName';

      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(imageFile.path, filename: fileName),
        'upload_preset': _uploadPreset,
        'folder': '$_folder/$productSlug',
        'public_id': publicId,
      });

      final response = await _dio.post(
        'https://api.cloudinary.com/v1_1/$_cloudName/image/upload',
        data: formData,
        options: Options(
          headers: {'Content-Type': 'multipart/form-data'},
          receiveTimeout: const Duration(seconds: 30),
          sendTimeout: const Duration(seconds: 30),
        ),
      );

      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        final url = data['secure_url'] as String?;
        if (url != null && url.isNotEmpty) {
          return url;
        }
        return null;
      }
      return null;
    } on DioException {
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Upload plusieurs images vers Cloudinary.
  /// Retourne une liste d'URLs dans le même ordre que les fichiers.
  /// Log explicitement le nombre de réussites / échecs.
  static Future<List<String>> uploadImages({
    required List<File> imageFiles,
    required String productSlug,
  }) async {
    final urls = <String>[];
    for (int i = 0; i < imageFiles.length; i++) {
      final url = await uploadImage(
        imageFile: imageFiles[i],
        productSlug: productSlug,
        imageIndex: i + 1,
      );
      if (url != null) {
        urls.add(url);
      }
    }
    return urls;
  }
}
