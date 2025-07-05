/*
  # Insert Sample Booking Data

  This migration inserts the sample booking data you provided to test the database schema.
*/

-- Insert sample bookings using the function
SELECT create_booking_with_items('{
  "id": "order_20250601124200_9085",
  "timestamp": "2025-06-01 12:42:00 -0400",
  "items": [
    {
      "type": "studio_session",
      "session_id": "REC-088771JOFRSU",
      "studio_name": "Studio C",
      "date": "2025-06-27",
      "time_slot": "3:00 PM - 7:00 PM",
      "session_type": "Recording",
      "duration": 4,
      "price": 140
    }
  ],
  "status": "pending",
  "has_studio_session": true,
  "has_consultation": false,
  "stripe_session_id": "cs_test_a1mPm4148mb6gIiElQTtgx5VHHIStMQPbVkXeKVdwXABY8H9Mp37JH3Kt9"
}'::jsonb);

SELECT create_booking_with_items('{
  "id": "order_20250601123545_5278",
  "timestamp": "2025-06-01 12:35:45 -0400",
  "items": [
    {
      "type": "studio_session",
      "session_id": "REC-721903H4INZF",
      "studio_name": "Studio C",
      "date": "2025-06-24",
      "time_slot": "7:30 PM - 11:30 PM",
      "session_type": "Recording",
      "duration": 4,
      "price": 140
    }
  ],
  "status": "pending",
  "has_studio_session": true,
  "has_consultation": false,
  "stripe_session_id": "cs_test_a1oqjioloBz2vFggp9TuWYkYk7NPwtQvyTdg1pnkzJcJvvzG7wlOTRuqvH"
}'::jsonb);

SELECT create_booking_with_items('{
  "id": "order_20250601123148_3932",
  "timestamp": "2025-06-01 12:31:48 -0400",
  "items": [
    {
      "type": "service",
      "service_id": "mastering_only",
      "service_name": "Mastering",
      "price": 50,
      "category": "mastering"
    }
  ],
  "status": "pending",
  "has_studio_session": false,
  "has_consultation": false,
  "stripe_session_id": "cs_test_a1NbD1LAilnAnF9dEr4fO94VeRIIuj5SJxRTvXRg7myY0XeDiprUuYFotm"
}'::jsonb);

SELECT create_booking_with_items('{
  "id": "order_20250601120405_5859",
  "timestamp": "2025-06-01 12:04:05 -0400",
  "items": [
    {
      "type": "beat",
      "beat_id": "afrobeats_001",
      "beat_title": "Lagos Nights",
      "license_type": "lease",
      "price": 50,
      "cover_path": "https://via.placeholder.com/400x400/2a1a1a/60efff?text=Lagos+Nights"
    }
  ],
  "status": "pending",
  "has_studio_session": false,
  "has_consultation": false,
  "stripe_session_id": "cs_test_a17QjsGpIeY7ng6YoWFcH2daciN2nFaojSiN2bmyqfItpwsNvi0FCoAzkl"
}'::jsonb);

SELECT create_booking_with_items('{
  "id": "order_20250601115658_2561",
  "timestamp": "2025-06-01 11:56:58 -0400",
  "items": [
    {
      "type": "studio_session",
      "session_id": "REC-3831821N4P41",
      "studio_name": "Studio C",
      "date": "2025-06-24",
      "time_slot": "7:30 PM - 11:30 PM",
      "session_type": "Recording",
      "duration": 4,
      "price": 140
    }
  ],
  "status": "pending",
  "has_studio_session": true,
  "has_consultation": false,
  "stripe_session_id": "cs_test_a1MCz6nFN3tNHeumaWdPDya0tfsObM7pNZTVdIdNtzGCyAq0fsZDdS1E6y"
}'::jsonb);