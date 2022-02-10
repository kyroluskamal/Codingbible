﻿using System.ComponentModel.DataAnnotations;

namespace CodingBible.Models
{
    public class RegisterViewModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Firstname { get; set; }
        [Required]
        public string Lastname { get; set; }
        public bool IsActive  { get; set; }
        public bool RememberMe  { get; set; }
        public string ClientUrl { get; set; }
    }
}
